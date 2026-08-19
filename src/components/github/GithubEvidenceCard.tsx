"use client";

import { useEffect, useState } from "react";
import { Github, Loader2, RefreshCw, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiPost } from "@/lib/api";
import { GithubEvidenceService } from "@/services/github-evidence.service";
import type { GithubEvaluateResponse, GithubSkillScores, GithubAIFeedback } from "@/types/github.types";

/**
 * Evidencia técnica de GitHub: dispara la evaluación y muestra el último resultado.
 *
 * La evaluación es **siempre manual**. Al montarse solo LEE `github_evidence/{uid}` para enseñar
 * el resultado anterior; nunca llama al endpoint por su cuenta. Evaluar consume cuota de la API de
 * GitHub y una llamada a Mistral, así que dispararlo automáticamente al abrir el perfil
 * multiplicaría el coste sin que nadie lo pidiera.
 */

interface EvidenceView {
  analyzedRepo: string;
  skillScores: GithubSkillScores;
  aiFeedback: GithubAIFeedback | null;
  analyzedAt: string | null;
  cached: boolean;
}

/** Extrae el usuario de una URL de GitHub (`https://github.com/foo` → `foo`). */
export function parseGithubUsername(value: string | undefined | null): string {
  if (!value) return "";
  const trimmed = value.trim().replace(/\/+$/, "");
  const match = trimmed.match(/github\.com\/([^/?#]+)/i);
  return (match ? match[1] : trimmed).trim();
}

/** Fecha legible tolerando Timestamp de Firestore, forma serializada o ISO. */
function formatAnalyzedAt(value: unknown): string | null {
  if (!value) return null;
  let ms: number | null = null;
  if (typeof value === "string") ms = Date.parse(value);
  else if (typeof value === "object") {
    const v = value as { seconds?: number; _seconds?: number; toDate?: () => Date };
    if (typeof v.toDate === "function") ms = v.toDate().getTime();
    else if (typeof v.seconds === "number") ms = v.seconds * 1000;
    else if (typeof v._seconds === "number") ms = v._seconds * 1000;
  }
  if (ms === null || Number.isNaN(ms)) return null;
  return new Date(ms).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" });
}

export function GithubEvidenceCard({
  uid,
  githubUrl,
}: {
  uid: string;
  githubUrl?: string;
}) {
  const [username, setUsername] = useState("");
  const [repoName, setRepoName] = useState("");
  const [evidence, setEvidence] = useState<EvidenceView | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solo lectura del último resultado. No evalúa.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const stored = await GithubEvidenceService.getEvidence(uid);
        if (cancelled) return;
        if (stored) {
          setEvidence({
            analyzedRepo: stored.analyzedRepo,
            skillScores: stored.skillScores,
            aiFeedback: stored.aiFeedback,
            analyzedAt: formatAnalyzedAt(stored.analyzedAt),
            cached: false,
          });
          setUsername(stored.githubUsername ?? "");
        }
      } catch (err) {
        console.error("[GithubEvidenceCard] no se pudo leer la evidencia previa:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  // Prefill desde el perfil, sin pisar lo que el usuario haya escrito.
  useEffect(() => {
    setUsername((prev) => prev || parseGithubUsername(githubUrl));
  }, [githubUrl]);

  const evaluate = async () => {
    const user = username.trim();
    if (!user) {
      setError("Escribe tu usuario de GitHub.");
      return;
    }
    setEvaluating(true);
    setError(null);
    try {
      const res = await apiPost<GithubEvaluateResponse>("/api/github/evaluate", {
        githubUsername: user,
        ...(repoName.trim() ? { repoName: repoName.trim() } : {}),
      });
      setEvidence({
        analyzedRepo: res.analyzedRepo,
        skillScores: res.skillScores,
        aiFeedback: res.aiFeedback,
        analyzedAt: formatAnalyzedAt(res.analyzedAt),
        cached: res.cached,
      });
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(
        code === "no_repos_found"
          ? `No se encontraron repositorios públicos para "${user}".`
          : code === "repo_not_found"
            ? "No se encontró ese repositorio en la cuenta indicada."
            : "No se pudo evaluar el repositorio. Inténtalo de nuevo en unos segundos."
      );
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
            <Github className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold italic">Evidencia de GitHub.</h2>
          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md">
            Análisis determinístico de tu código real. Se ejecuta solo cuando tú lo pides.
          </p>
        </div>
        {evidence?.analyzedAt && (
          <div className="text-right">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-300">
              Último análisis
            </span>
            <span className="text-xs font-medium text-gray-500">{evidence.analyzedAt}</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">
            Usuario de GitHub
          </Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="tu-usuario"
            className="h-12 bg-gray-50 border-none rounded-xl px-5 font-bold"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">
            Repositorio (opcional)
          </Label>
          <Input
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="El más reciente si lo dejas vacío"
            className="h-12 bg-gray-50 border-none rounded-xl px-5 font-medium"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-brand-red/5 text-brand-red rounded-2xl p-4 text-xs font-bold">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <Button
        onClick={evaluate}
        disabled={evaluating || loading}
        className="w-full h-14 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-apple disabled:opacity-40"
      >
        {evaluating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analizando repositorio...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            {evidence ? "Recalificar GitHub" : "Calificar mi GitHub"}
          </>
        )}
      </Button>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
        </div>
      ) : evidence ? (
        <EvidenceResult evidence={evidence} />
      ) : (
        <p className="text-xs text-gray-400 text-center font-medium pt-2">
          Aún no has analizado ningún repositorio.
        </p>
      )}
    </div>
  );
}

function EvidenceResult({ evidence }: { evidence: EvidenceView }) {
  const s = evidence.skillScores;
  return (
    <div className="space-y-8 pt-4 border-t border-gray-50">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="bg-gray-900 text-white border-none rounded-full py-1.5 px-4 text-[9px] font-bold uppercase tracking-widest">
          {evidence.analyzedRepo}
        </Badge>
        {evidence.cached && (
          <Badge className="bg-brand-green/10 text-brand-green border-none rounded-full py-1.5 px-4 text-[9px] font-bold uppercase tracking-widest">
            <CheckCircle2 className="h-3 w-3 mr-1.5" /> Sin cambios desde el último commit
          </Badge>
        )}
        {!s.hasASTData && (
          <Badge className="bg-brand-orange/10 text-brand-orange border-none rounded-full py-1.5 px-4 text-[9px] font-bold uppercase tracking-widest">
            <AlertTriangle className="h-3 w-3 mr-1.5" /> Sin archivos analizables
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ScoreTile label="Global" value={s.overall} highlight />
        <ScoreTile label="Arquitectura" value={s.architecture} />
        <ScoreTile label="Seguridad" value={s.security} />
        <ScoreTile label="Mantenibilidad" value={s.maintainability} />
        <ScoreTile label="Testing" value={s.testing} />
        <ScoreTile label="Documentación" value={s.documentation} />
      </div>

      {evidence.aiFeedback && (
        <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-purple" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Lectura del evaluador
            </span>
          </div>
          <p className="text-sm font-medium leading-relaxed text-gray-700">
            {evidence.aiFeedback.feedback}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeedbackList title="Fortalezas" items={evidence.aiFeedback.strengths} tone="green" />
            <FeedbackList title="A mejorar" items={evidence.aiFeedback.improvements} tone="orange" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * `null` significa "no analizable", NO cero.
 *
 * Distinguirlo importa: el motor devuelve `null` cuando no pudo parsear archivos del repositorio,
 * y pintar un 0 (o peor, un 100) convertiría un "no lo sé" en un juicio sobre el candidato.
 */
function ScoreTile({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number | null;
  highlight?: boolean;
}) {
  const analyzable = value !== null;
  return (
    <div className={`rounded-2xl p-5 ${highlight ? "bg-brand-blue text-white" : "bg-gray-50"}`}>
      <span
        className={`block text-[9px] font-black uppercase tracking-widest mb-2 ${
          highlight ? "text-white/60" : "text-gray-300"
        }`}
      >
        {label}
      </span>
      {analyzable ? (
        <span className="text-3xl font-black italic tracking-tighter">{value}</span>
      ) : (
        <span
          className={`text-xs font-bold ${highlight ? "text-white/70" : "text-gray-400"}`}
          title="El lenguaje del repositorio no pudo analizarse con el parser actual"
        >
          No analizable
        </span>
      )}
    </div>
  );
}

function FeedbackList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "green" | "orange";
}) {
  if (items.length === 0) return null;
  const dot = tone === "green" ? "bg-brand-green" : "bg-brand-orange";
  return (
    <div className="space-y-3">
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{title}</span>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-xs font-medium text-gray-600 leading-relaxed">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
