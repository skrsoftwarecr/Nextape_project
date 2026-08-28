"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Zap,
  Loader2,
  Map,
  CheckCircle2,
  Lock,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase/client";
import { RoadmapService } from "@/services/roadmap.service";
import { computeRoadmap } from "@/lib/roadmap-engine";
import {
  TARGET_ROLES,
  type TargetRole,
  type SeniorityLevel,
} from "@/services/github-engine/role-mapping/role-weights";
import type { RoadmapItem, RoadmapRoute, Skill } from "@/types/roadmap.types";
import { onAuthStateChanged, User } from "firebase/auth";

const ROLE_OPTIONS: { id: TargetRole; label: string }[] = [
  { id: "backend", label: "Backend (MVP)" },
  { id: "frontend", label: "Frontend" },
  { id: "fullstack", label: "Fullstack" },
  { id: "devops", label: "DevOps" },
  { id: "mobile", label: "Mobile" },
];

const CATEGORY_LABELS: Record<string, string> = {
  language: "Lenguaje & Runtime",
  database: "Bases de Datos",
  "api-design": "Diseño de APIs",
  infrastructure: "Infraestructura",
  testing: "Testing & Calidad",
  security: "Seguridad",
  architecture: "Arquitectura",
  tooling: "Herramientas & Entorno",
  observability: "Observabilidad",
};

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [targetRole, setTargetRole] = useState<TargetRole>("backend");
  const [inferredLevel, setInferredLevel] = useState<SeniorityLevel>("junior");
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * Skills que además se pueden practicar en The LINE (tienen repertorio precargado).
   *
   * Cierra el ciclo roadmap → práctica → DNA: sin esto el roadmap dice qué te falta pero no
   * ofrece cómo cubrirlo. Solo se muestra el atajo cuando la skill existe de verdad en el banco;
   * enviar al usuario a una combinación sin preguntas sería peor que no ofrecer nada.
   */
  const [practicable, setPracticable] = useState<Record<string, string[]>>({});

  useEffect(() => {
    apiGet<{ available: Record<string, string[]> }>("/api/line/catalog")
      .then((res) => setPracticable(res.available))
      .catch(() => setPracticable({}));
  }, []);

  const calculateUserRoadmap = useCallback(async (uid: string, role: TargetRole) => {
    setComputing(true);
    setErrorMsg(null);
    try {
      // 1. Obtener DNA del usuario (The LINE)
      const userSkillsDoc = await RoadmapService.getDNA(uid);
      const dna = userSkillsDoc?.scores || {};

      // 2. Inferir nivel actual a partir de SENIORITY_THRESHOLDS
      const currentLevel = RoadmapService.inferUserLevel(dna);
      setInferredLevel(currentLevel);

      // Definir nivel objetivo según nivel inferido
      const targetLevel: SeniorityLevel = currentLevel === "junior" ? "mid" : "senior";
      const routeId = `${role}_${currentLevel}_to_${targetLevel}`;

      // 3. Cargar la ruta desde Firestore
      let route = await RoadmapService.getRoute(routeId);

      // Fallback para MVP si no se encuentra la ruta específica de otro rol
      if (!route && role === "backend") {
        route = await RoadmapService.getRoute("backend_junior_to_mid");
      }

      if (!route) {
        setItems([]);
        setErrorMsg(
          `La ruta ${role.toUpperCase()} (${currentLevel} → ${targetLevel}) aún no está disponible en el catálogo MVP. Ruta activa disponible: Backend Junior → Mid.`
        );
        return;
      }

      // 4. Cargar las skills requeridas por la ruta desde skill_catalog
      const skillIds = Object.keys(route.skillWeights);
      const catalog = await RoadmapService.getCatalogSkills(skillIds);

      if (catalog.length === 0) {
        setItems([]);
        setErrorMsg(
          "El catálogo de habilidades aún no ha sido poblado en Firestore. Ejecuta 'npm run seed:catalog -- --yes' para precargar las 18 skills."
        );
        return;
      }

      // 5. Cargar evidencia del GitHub Engine (opcional como proxy)
      const githubDoc = await RoadmapService.getGithubEvidence(uid);
      const githubScores = githubDoc?.skillScores;

      // 6. Computar roadmap determinístico
      const computedResult = computeRoadmap({
        route,
        catalog,
        dna,
        githubScores,
      });

      setItems(computedResult.items);
    } catch (error) {
      console.error("Error computing roadmap:", error);
      setErrorMsg("Ocurrió un error al procesar el roadmap determinístico.");
    } finally {
      setComputing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        calculateUserRoadmap(currentUser.uid, targetRole);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [calculateUserRoadmap, targetRole]);

  const handleRoleChange = (newRole: TargetRole) => {
    setTargetRole(newRole);
    if (user) {
      calculateUserRoadmap(user.uid, newRole);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const completed = items.filter((i) => i.status === "completed");
  const available = items.filter((i) => i.status === "gap");
  const blocked = items.filter((i) => i.status === "blocked");

  // El motor ya ordena topológicamente y prioriza: el primer hueco disponible ES el siguiente paso.
  const [nextStep, ...restAvailable] = available;
  const evaluated = completed.length + available.length + blocked.length;
  const progress = evaluated > 0 ? Math.round((completed.length / evaluated) * 100) : 0;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-black italic">Roadmap.</h1>
          <p className="text-gray-500 font-medium text-sm">
            Tu ruta hacia {ROLE_OPTIONS.find((r) => r.id === targetRole)?.label ?? targetRole},
            calculada a partir de tu DNA técnico.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => user && calculateUserRoadmap(user.uid, targetRole)}
          disabled={computing}
          className="rounded-2xl h-12 px-6 border-gray-200 font-bold uppercase tracking-widest text-[10px]"
        >
          {computing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Recalcular
        </Button>
      </header>

      {/* Rol objetivo */}
      <div className="flex flex-wrap gap-2">
        {ROLE_OPTIONS.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-colors",
              targetRole === role.id
                ? "bg-black text-white"
                : "bg-white text-gray-500 border border-gray-100 hover:text-black"
            )}
          >
            {role.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-6 bg-brand-orange/5 border border-brand-orange/20 rounded-[2rem] flex items-start gap-4 text-sm">
          <AlertCircle className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
          <p className="font-medium text-gray-700">{errorMsg}</p>
        </div>
      )}

      {items.length === 0 && !errorMsg ? (
        <div className="p-16 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center space-y-5">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
            <Map className="h-7 w-7 text-gray-300" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold italic">Aún no podemos trazar tu ruta.</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
              Completa una prueba en The LINE para que tu DNA técnico tenga datos con los que
              calcular tu progresión.
            </p>
          </div>
          <Link href="/dashboard/line">
            <Button className="bg-black text-white rounded-2xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]">
              Ir a The LINE <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Progreso hacia el nivel objetivo */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-apple border border-gray-50 space-y-5">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 block mb-1">
                  Progreso hacia {inferredLevel === "junior" ? "mid" : "senior"}
                </span>
                <span className="text-3xl font-black italic tracking-tighter">
                  {completed.length}
                  <span className="text-gray-300"> / {evaluated}</span>
                </span>
                <span className="text-xs text-gray-400 font-medium ml-2">habilidades dominadas</span>
              </div>
              <span className="text-4xl font-black italic tracking-tighter text-brand-blue">{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
              <div
                className="h-full bg-brand-blue rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          {/* SIGUIENTE PASO — el motor calcula exactamente esto; es lo único que hay que decidir hoy */}
          {nextStep && (
            <section className="bg-gray-950 text-white rounded-[2.5rem] p-10 shadow-apple-lg space-y-8 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue">
                  Tu siguiente paso
                </span>
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">
                    {nextStep.skillName}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">
                    {CATEGORY_LABELS[nextStep.category] ?? nextStep.category}
                    {nextStep.scoreSource !== "none" && (
                      <> · medido con {nextStep.scoreSource === "line" ? "The LINE" : "tu código de GitHub"}</>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-gray-500">Ahora {nextStep.currentScore}%</span>
                    <span className="text-brand-blue">Objetivo {nextStep.targetScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden relative">
                    <div
                      className="h-full bg-brand-blue rounded-full"
                      style={{ width: `${Math.min(nextStep.currentScore, 100)}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 border-l-2 border-dashed border-white/40"
                      style={{ left: `${Math.min(nextStep.targetScore, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    Te faltan {nextStep.deficit} puntos para alcanzar el nivel objetivo.
                  </p>
                </div>

                {practicable[nextStep.skillId] && (
                  <Link href={`/dashboard/line?technology=${encodeURIComponent(nextStep.skillId)}`}>
                    <Button className="h-14 px-8 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                      Practicar en The LINE <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl" />
            </section>
          )}

          {/* Resto de habilidades disponibles */}
          {restAvailable.length > 0 && (
            <section className="space-y-4">
              <SectionTitle icon={Zap} label="Disponibles ahora" count={restAvailable.length} />
              <div className="space-y-3">
                {restAvailable.map((item) => (
                  <div
                    key={item.skillId}
                    className="bg-white rounded-2xl p-5 border border-gray-50 shadow-apple flex flex-wrap items-center gap-4"
                  >
                    <div className="flex-grow min-w-0 space-y-1">
                      <p className="font-bold truncate">{item.skillName}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </p>
                    </div>
                    <ScoreGap item={item} />
                    {practicable[item.skillId] && (
                      <Link href={`/dashboard/line?technology=${encodeURIComponent(item.skillId)}`}>
                        <Button variant="ghost" className="rounded-xl text-brand-blue font-bold uppercase tracking-widest text-[9px]">
                          Practicar
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bloqueadas — lo importante es POR QUÉ, que el motor ya calcula y antes no se leía bien */}
          {blocked.length > 0 && (
            <section className="space-y-4">
              <SectionTitle icon={Lock} label="Se desbloquean después" count={blocked.length} />
              <div className="space-y-3">
                {blocked.map((item) => (
                  <div
                    key={item.skillId}
                    className="bg-gray-50/60 rounded-2xl p-5 border border-gray-100 flex flex-wrap items-center gap-4"
                  >
                    <div className="flex-grow min-w-0 space-y-1.5">
                      <p className="font-bold text-gray-500 truncate">{item.skillName}</p>
                      {item.blockedBy.length > 0 && (
                        <p className="text-[11px] text-gray-400 font-medium">
                          Domina primero{" "}
                          <span className="text-gray-600 font-bold">{item.blockedBy.join(", ")}</span>
                        </p>
                      )}
                    </div>
                    <Lock className="h-4 w-4 text-gray-300 shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dominadas — logro, no ruido: compactas y al final */}
          {completed.length > 0 && (
            <section className="space-y-4">
              <SectionTitle icon={CheckCircle2} label="Ya dominas" count={completed.length} />
              <div className="flex flex-wrap gap-2">
                {completed.map((item) => (
                  <span
                    key={item.skillId}
                    className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full py-2 px-4 text-xs font-bold text-gray-600 shadow-apple"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-green" />
                    {item.skillName}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  label,
  count,
}: {
  icon: typeof Zap;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-gray-300" />
      <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400">{label}</h2>
      <span className="text-[11px] font-bold text-gray-300">{count}</span>
    </div>
  );
}

/** Score actual frente al objetivo, en una barra compacta. */
function ScoreGap({ item }: { item: RoadmapItem }) {
  return (
    <div className="w-32 shrink-0 space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold">
        <span className="text-gray-500">{item.currentScore}%</span>
        <span className="text-gray-300">{item.targetScore}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-brand-blue rounded-full"
          style={{ width: `${Math.min(item.currentScore, 100)}%` }}
        />
      </div>
    </div>
  );
}
