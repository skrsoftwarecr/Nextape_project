"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Clock,
  Zap,
  Loader2,
  Map,
  Target,
  CheckCircle2,
  Lock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const completedCount = items.filter((i) => i.status === "completed").length;
  const gapsCount = items.filter((i) => i.status === "gap").length;
  const blockedCount = items.filter((i) => i.status === "blocked").length;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest rounded-full">
              Determinístico · Sin IA
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Nivel actual inferido: {inferredLevel.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-black italic">Roadmap de Progresión.</h1>
          <p className="text-gray-500 font-medium">
            Ruta de habilidades y prerequisitos calculada de forma 100% determinística a partir de tu DNA técnico.
          </p>
        </div>
        <Button
          disabled={computing || !user}
          onClick={() => user && calculateUserRoadmap(user.uid, targetRole)}
          className="h-12 px-6 bg-brand-blue rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-apple hover:scale-105 transition-all text-white"
        >
          {computing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Recalcular Ruta
        </Button>
      </header>

      {/* Selector de Rol Objetivo */}
      <section className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-apple space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Rol Objetivo</h2>
            <p className="text-xs text-gray-400">
              Selecciona la especialidad técnica para resolver los pesos de ruta y dependencias.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {ROLE_OPTIONS.map((role) => {
            const isSelected = targetRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                disabled={computing}
                onClick={() => handleRoleChange(role.id)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                  isSelected
                    ? "bg-black text-white shadow-md scale-105"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black"
                )}
              >
                {role.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Métricas de estado del Roadmap */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-apple flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Dominadas</span>
              <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-apple flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Brechas Críticas (Gaps)</span>
              <p className="text-2xl font-black text-brand-blue">{gapsCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-apple flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bloqueadas por Prereq</span>
              <p className="text-2xl font-black text-amber-500">{blockedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-4 text-amber-900 text-sm">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Información de ruta</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Lista ordenada topológicamente */}
      <div className="grid grid-cols-1 gap-4">
        {items.length > 0 ? (
          items.map((item) => {
            const isCompleted = item.status === "completed";
            const isBlocked = item.status === "blocked";
            const isGap = item.status === "gap";

            return (
              <div
                key={item.skillId}
                className={cn(
                  "bg-white rounded-2xl p-6 border shadow-apple transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6",
                  isCompleted && "border-emerald-100 bg-emerald-50/10 opacity-90",
                  isGap && "border-blue-100",
                  isBlocked && "border-gray-200 bg-gray-50/40"
                )}
              >
                <div className="flex gap-5 items-start md:items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                      isCompleted && "bg-emerald-100 text-emerald-700",
                      isGap && "bg-brand-blue/10 text-brand-blue",
                      isBlocked && "bg-gray-200 text-gray-500"
                    )}
                  >
                    {item.order}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      {item.scoreSource !== "none" && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                          Fuente: {item.scoreSource === "line" ? "The LINE" : "GitHub Engine"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-black flex items-center gap-2">
                      {item.skillName}
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                      {isBlocked && <Lock className="h-4 w-4 text-amber-500 shrink-0" />}
                    </h3>
                    {isBlocked && item.blockedBy.length > 0 && (
                      <p className="text-xs text-amber-600 font-medium">
                        Requiere dominar primero: {item.blockedBy.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Score</span>
                    <span className="text-sm font-bold text-black">
                      {item.currentScore}% / <span className="text-gray-400">{item.targetScore}%</span>
                    </span>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Prioridad</span>
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1",
                        item.priority === "critical" && "text-brand-red",
                        item.priority === "high" && "text-amber-600",
                        item.priority === "medium" && "text-brand-blue",
                        item.priority === "low" && "text-gray-500",
                        item.priority === "none" && "text-emerald-600"
                      )}
                    >
                      {item.priority !== "none" && <Zap className="h-3 w-3" />}
                      {item.priority}
                    </span>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Estado</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full",
                        isCompleted && "bg-emerald-100 text-emerald-800",
                        isGap && "bg-blue-100 text-blue-800",
                        isBlocked && "bg-amber-100 text-amber-800"
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          !errorMsg && (
            <div className="p-16 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center space-y-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Map className="h-7 w-7 text-gray-300" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-black">Sin datos para este rol.</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Selecciona Backend Junior→Mid para ver el grafo determinístico de habilidades.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
