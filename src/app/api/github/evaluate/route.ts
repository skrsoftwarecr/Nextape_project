import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, verifyRequestUid } from '@/lib/firebase/admin';
import { GithubSignalsService } from '@/services/github-signals.service';
import { analyzeRepositorySources } from '@/services/github-engine';
import { generateGithubFeedback } from '@/ai/flows/generate-github-feedback-flow';
import type { GithubEvidence, GithubEvaluateResponse } from '@/types/github.types';

export const runtime = 'nodejs';

/**
 * POST /api/github/evaluate
 * Route Handler autenficado (Admin SDK) para evaluar un repositorio de GitHub.
 *
 * Flujo:
 *  1. Repositorio -> GitHub Signals (Capa 1)
 *  2. Parser (AST) -> IR Universal -> Motor Matemático (Capa 2) -> Scores
 *  3. IA Mistral interpreta métricas finales (Capa 3) (nunca ve código fuente)
 *  4. Persiste resultado en `github_evidence/{uid}`
 *  5. Cache por SHA: si el commit SHA no cambió, se devuelve el resultado cacheado.
 *
 * Body: { githubUsername: string, repoName?: string }
 * Auth: Authorization: Bearer <Firebase ID token>
 */
export async function POST(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get('authorization'));
  if (!uid) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch (jsonErr) {
    console.warn('[github/evaluate] Error parseando JSON del cuerpo de la petición:', jsonErr);
    return NextResponse.json({ error: 'invalid_json', message: 'El cuerpo de la petición no es un JSON válido' }, { status: 400 });
  }

  const githubUsername: string | undefined = typeof body?.githubUsername === 'string' ? body.githubUsername : undefined;
  const repoName: string | undefined = typeof body?.repoName === 'string' ? body.repoName : undefined;

  if (!githubUsername) {
    return NextResponse.json({ error: 'missing_github_username' }, { status: 400 });
  }

  try {
    // 1. Capa 1: Repositorios del usuario
    const userRepos = await GithubSignalsService.getUserRepos(githubUsername);
    if (userRepos.length === 0) {
      return NextResponse.json(
        { error: 'no_repos_found', message: `No se encontraron repositorios públicos para ${githubUsername}` },
        { status: 404 },
      );
    }

    // Seleccionar repo objetivo (especificado por el usuario o el más recientemente actualizado)
    const targetRepoInfo = repoName
      ? userRepos.find((r) => r.name.toLowerCase() === repoName.toLowerCase() || r.fullName.toLowerCase() === repoName.toLowerCase())
      : userRepos[0];

    if (!targetRepoInfo) {
      return NextResponse.json(
        { error: 'repo_not_found', message: `Repositorio '${repoName}' no encontrado para ${githubUsername}` },
        { status: 404 },
      );
    }

    const { owner, name: repo } = targetRepoInfo;
    const fullRepoName = `${owner}/${repo}`;

    // Obtener señales del repositorio (incluye lastCommitSHA)
    const repoSignals = await GithubSignalsService.getRepoSignals(owner, repo);

    // 2. Cache por SHA: consultar en `github_evidence/{uid}`
    const docRef = adminDb().collection('github_evidence').doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const cachedData = docSnap.data() as GithubEvidence;
      if (
        cachedData.analyzedRepo === fullRepoName &&
        cachedData.lastCommitSHA === repoSignals.lastCommitSHA &&
        repoSignals.lastCommitSHA !== ''
      ) {
        console.log(`[github/evaluate] Cache HIT para ${fullRepoName} (SHA: ${repoSignals.lastCommitSHA})`);
        const response: GithubEvaluateResponse = {
          cached: true,
          analyzedRepo: cachedData.analyzedRepo,
          skillScores: cachedData.skillScores,
          aiFeedback: cachedData.aiFeedback,
          analyzedAt: new Date().toISOString(),
        };
        return NextResponse.json(response);
      }
    }

    console.log(`[github/evaluate] Cache MISS para ${fullRepoName}. Ejecutando motor determinístico...`);

    // 3. Descargar archivos centrales para el parser AST
    const centralFiles = await GithubSignalsService.fetchCentralSourceFiles(
      owner,
      repo,
      repoSignals.lastCommitSHA,
    );

    // 4. Capa 2: Motor Determinístico (AST -> IR -> Analyzers -> Skill Mapper)
    const { metrics, skillScores } = analyzeRepositorySources(centralFiles, repoSignals);

    // 5. Capa 3: Interpretación con IA (Mistral) — solo recibe objeto de scores numéricos
    const aiFeedback = await generateGithubFeedback({
      architecture: skillScores.architecture,
      testing: skillScores.testing,
      security: skillScores.security,
      maintainability: skillScores.maintainability,
      documentation: skillScores.documentation,
      overall: skillScores.overall,
      topWeaknesses: skillScores.topWeaknesses,
    });

    // 6. Guardar en `github_evidence/{uid}` con Admin SDK
    const evidenceData: GithubEvidence = {
      uid,
      githubUsername,
      analyzedRepo: fullRepoName,
      lastCommitSHA: repoSignals.lastCommitSHA,
      repoSignals,
      metrics,
      skillScores,
      aiFeedback,
      analyzedAt: FieldValue.serverTimestamp() as unknown as FirebaseFirestore.Timestamp,
      engineVersion: '1.0.0',
    };

    await docRef.set(evidenceData, { merge: true });

    const response: GithubEvaluateResponse = {
      cached: false,
      analyzedRepo: fullRepoName,
      skillScores,
      aiFeedback,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('[github/evaluate] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: 'server_error', message }, { status: 500 });
  }
}
