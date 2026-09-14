import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";
import { GithubSignalsService } from "@/services/github-signals.service";
import { analyzeRepositorySources } from "@/services/github-engine";
import {
  GITHUB_ENGINE_VERSION,
  GITHUB_REPO_NAME_PATTERN,
  GITHUB_USERNAME_PATTERN,
  repoDocId,
} from "@/services/github-engine/evidence-keys";
import { consumeRateLimit, GITHUB_RATE_LIMITS, rateLimitedResponse } from "@/lib/server/rate-limit";
import type { GithubRepoEvaluateResponse, GithubRepoEvidence } from "@/types/github.types";

export const runtime = "nodejs";

/**
 * POST /api/github/evaluate
 * Analiza UN repositorio de la cuenta y guarda el resultado en `github_evidence/{uid}/repos/{repoId}`.
 *
 * Antes este endpoint analizaba un único repositorio —el más reciente— y ese resultado era todo el
 * perfil. Ahora es una pieza del análisis completo: el cliente lo llama una vez por repositorio
 * (cada llamada cabe en el tiempo de una Netlify Function) y al final `/api/github/aggregate`
 * combina todos. No llama a Mistral: la lectura de IA se hace una sola vez sobre el agregado.
 *
 * Caché: si el último commit no cambió desde el último análisis con esta versión del motor, se
 * devuelve lo guardado sin descargar ni parsear de nuevo.
 *
 * Body: { githubUsername: string, repoName: string }   // "repo" u "owner/repo"
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_json" }, { status: 400 });

  const githubUsername = typeof body.githubUsername === "string" ? body.githubUsername.trim() : "";
  const repoName = typeof body.repoName === "string" ? body.repoName.trim() : "";
  if (!GITHUB_USERNAME_PATTERN.test(githubUsername)) {
    return NextResponse.json({ error: "invalid_github_username" }, { status: 400 });
  }
  if (!repoName) return NextResponse.json({ error: "missing_repo" }, { status: 400 });

  const [ownerPart, namePart] = repoName.includes("/")
    ? repoName.split("/", 2)
    : [githubUsername, repoName];

  // Solo repositorios de la propia cuenta analizada. Sin esto se podría meter en el perfil de una
  // cuenta el código de cualquier repositorio público ajeno.
  if (repoName.split("/").length > 2 || !GITHUB_REPO_NAME_PATTERN.test(namePart ?? "")) {
    return NextResponse.json({ error: "invalid_repo_name" }, { status: 400 });
  }
  if (ownerPart.toLowerCase() !== githubUsername.toLowerCase()) {
    return NextResponse.json({ error: "repo_not_owned" }, { status: 400 });
  }

  const owner = ownerPart;
  const repo = namePart;
  const fullName = `${owner}/${repo}`;

  try {
    // Cada análisis gasta ~5 peticiones del GITHUB_TOKEN compartido por toda la plataforma.
    const limit = await consumeRateLimit(adminDb(), "github_evaluate", uid, GITHUB_RATE_LIMITS.evaluate);
    if (!limit.allowed) return rateLimitedResponse(limit);

    const docRef = adminDb()
      .collection("github_evidence")
      .doc(uid)
      .collection("repos")
      .doc(repoDocId(fullName));

    const [{ signals, tree, pushedAt }, existingSnap] = await Promise.all([
      GithubSignalsService.getRepoSnapshot(owner, repo),
      docRef.get(),
    ]);

    const existing = existingSnap.data() as GithubRepoEvidence | undefined;
    if (
      existing &&
      existing.engineVersion === GITHUB_ENGINE_VERSION &&
      signals.lastCommitSHA !== "" &&
      existing.lastCommitSHA === signals.lastCommitSHA
    ) {
      // Mantiene alineada la clave con la que el listado decide qué falta por analizar.
      if (existing.pushedAt !== pushedAt) await docRef.update({ pushedAt });
      const cached: GithubRepoEvaluateResponse = {
        cached: true,
        fullName,
        skillScores: existing.skillScores,
        filesAnalyzed: existing.filesAnalyzed ?? 0,
        parsedLanguages: existing.parsedLanguages ?? {},
      };
      return NextResponse.json(cached);
    }

    const files = await GithubSignalsService.fetchCentralSourceFiles(
      owner,
      repo,
      signals.lastCommitSHA,
      tree,
    );
    const { ir, metrics, skillScores } = analyzeRepositorySources(files, signals);

    const parsedLanguages: Record<string, number> = {};
    for (const file of ir.files) {
      parsedLanguages[file.language] = (parsedLanguages[file.language] ?? 0) + 1;
    }

    const evidence: GithubRepoEvidence = {
      uid,
      githubUsername,
      fullName,
      pushedAt,
      lastCommitSHA: signals.lastCommitSHA,
      repoSignals: signals,
      metrics,
      skillScores,
      filesAnalyzed: ir.files.length,
      parsedLanguages,
      analyzedAt: FieldValue.serverTimestamp() as unknown as FirebaseFirestore.Timestamp,
      engineVersion: GITHUB_ENGINE_VERSION,
    };
    await docRef.set(evidence);

    const response: GithubRepoEvaluateResponse = {
      cached: false,
      fullName,
      skillScores,
      filesAnalyzed: ir.files.length,
      parsedLanguages,
    };
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("No se pudo obtener información del repositorio")) {
      return NextResponse.json({ error: "repo_not_found" }, { status: 404 });
    }
    console.error("[github/evaluate] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
