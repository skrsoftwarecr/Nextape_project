/**
 * @fileOverview Motor determinístico del Roadmap de NEXTAPE.
 *
 * Función pura `computeRoadmap()`: sin efectos secundarios, sin IA, testeable aislada.
 * Ver docs/ROADMAP_DETERMINISTIC.md para los algoritmos completos.
 *
 * Diseño consciente — EXCEPCIÓN AL PATRÓN SERVER-TRUST:
 * Este cómputo se ejecuta en el cliente (browser), a diferencia del resto del sistema
 * (The LINE, GitHub Engine) que usa route handlers con Admin SDK.
 * Justificación: el Roadmap es exclusivamente lectura/cálculo. No escribe dato
 * verificado alguno, no modifica DNA ni scores. La integridad del sistema no está
 * en riesgo porque el resultado es solo una vista personalizada derivada del DNA
 * (que es write:false para el cliente) y del catálogo (que es inmutable desde el cliente).
 * Esto permite una UX más responsiva sin latencia de servidor adicional.
 * Ver docs/ARCHITECTURE.md §Excepciones al patrón server-trust.
 *
 * Algoritmos implementados:
 *   1. Score resolution  (§2.2): The LINE > GitHub Engine proxy > 0
 *   2. Prioridad         (§2.3): rawPriority = (deficit/100) × routeWeight → nivel discreto
 *   3. Kahn's topo sort  (§2.4): prerequisitos antes de sus dependientes, prioridad dentro del nivel
 */

import { SENIORITY_THRESHOLDS } from "@/services/github-engine/role-mapping/role-weights";
import type {
  ComputeRoadmapInput,
  RoadmapItem,
  RoadmapItemStatus,
  RoadmapPriority,
  ScoreSource,
  Skill,
} from "@/types/roadmap.types";

// ─────────────────────────────────────────────────────────
// §2.2 — Score Resolution
// ─────────────────────────────────────────────────────────

/**
 * Resuelve el score real de una skill para el usuario.
 *
 * Orden de prioridad:
 *   1. user_skill_scores (The LINE): evidencia directa y específica de la skill.
 *   2. github_evidence (GitHub Engine): proxy por dimensión agregada — menos preciso.
 *   3. 0: sin evidencia → gap forzado. Conservador y honesto.
 */
function resolveScore(
  skill: Skill,
  dna: Record<string, number>,
  githubScores: ComputeRoadmapInput["githubScores"]
): { score: number; source: ScoreSource } {
  // 1. The LINE — evidencia directa
  const lineScore = dna[skill.id] ?? dna[skill.id.toLowerCase()];
  if (lineScore !== undefined && typeof lineScore === "number") {
    return { score: lineScore, source: "line" };
  }

  // 2. GitHub Engine — proxy por dimensión
  if (skill.githubDimension !== null && githubScores) {
    const proxyScore = githubScores[skill.githubDimension];
    if (proxyScore !== null && proxyScore !== undefined) {
      return { score: proxyScore, source: "github" };
    }
  }

  // 3. Sin datos → gap forzado
  return { score: 0, source: "none" };
}

// ─────────────────────────────────────────────────────────
// §2.3 — Fórmula de Prioridad
// ─────────────────────────────────────────────────────────

/**
 * Calcula la prioridad discreta de una skill gap a partir de su déficit ponderado.
 *
 * Fórmula:
 *   rawPriority = (deficit / 100) × routeWeight
 *
 * Umbrales:
 *   ≥ 0.15 → 'critical'
 *   ≥ 0.08 → 'high'
 *   ≥ 0.03 → 'medium'
 *   >  0   → 'low'
 *   =  0   → 'none'  (skill completada)
 */
function calcPriority(deficit: number, routeWeight: number): RoadmapPriority {
  if (deficit <= 0) return "none";
  const raw = (deficit / 100) * routeWeight;
  if (raw >= 0.15) return "critical";
  if (raw >= 0.08) return "high";
  if (raw >= 0.03) return "medium";
  return "low";
}

/** Calcula el rawPriority numérico para ordenar dentro de un nivel topológico. */
function rawPriority(deficit: number, routeWeight: number): number {
  return (deficit / 100) * routeWeight;
}

/**
 * Implementación de Kahn's topological sort sobre el grafo de prerequisitos.
 *
 * Invariante dura: una skill con prerequisitos (dominados o no) nunca aparece antes
 * de sus prerequisitos en el resultado, sin importar su rawPriority.
 *
 * Criterio de orden en el resultado:
 *   1. PRIMARIO: nivel topológico (profundidad en el grafo de prerequisitos).
 *      Todos los prerequisitos de una skill tienen un nivel menor.
 *   2. SECUNDARIO: rawPriority DESC como desempate entre skills del MISMO nivel.
 *      Esto nunca puede empujar una skill fuera de su nivel topológico real.
 *
 * La clave del fix: los prerequisitos dominados (completed) siguen contando como
 * aristas del grafo para calcular el nivel topológico. Solo los prerequisitos
 * no-dominados bloquean el STATUS de la skill (gap vs blocked), pero el nivel
 * topológico se calcula sobre el grafo COMPLETO de prerequisitos.
 *
 * Complejidad: O(V + E) donde V = skills, E = aristas de prerequisitos.
 * Para el MVP Backend: ~18 nodos, ~30 aristas → <1ms.
 */
function kahnSort(
  skillIds: string[],
  prereqMap: Map<string, string[]>,
  priorityMap: Map<string, number>,
  _dominated: Set<string> // ya no se usa para el sort, solo para status
): string[] {
  const skillSet = new Set(skillIds);

  // Calcular in-degree basado en TODOS los prerequisitos que estén en la ruta
  // (no excluimos dominados — eso era el bug)
  const inDegree = new Map<string, number>();
  for (const id of skillIds) {
    const prereqs = (prereqMap.get(id) ?? []).filter((p) => skillSet.has(p));
    inDegree.set(id, prereqs.length);
  }

  // Nivel topológico de cada skill (profundidad en el grafo)
  const topoLevel = new Map<string, number>();

  // Cola inicial: skills sin prerequisitos en la ruta (nivel 0)
  let queue: string[] = skillIds.filter((id) => inDegree.get(id)! === 0);
  for (const id of queue) topoLevel.set(id, 0);

  // BFS por niveles de Kahn — calcula el nivel topológico de cada skill
  const processed = new Set<string>();
  const bfsOrder: string[] = [];

  while (queue.length > 0) {
    const nextQueue: string[] = [];

    // Ordenar por rawPriority DESC dentro del mismo nivel
    queue.sort((a, b) => (priorityMap.get(b) ?? 0) - (priorityMap.get(a) ?? 0));

    for (const current of queue) {
      if (processed.has(current)) continue;
      processed.add(current);
      bfsOrder.push(current);

      const currentLevel = topoLevel.get(current)!;

      // Para cada skill T que tiene 'current' como prerequisito
      for (const candidate of skillIds) {
        if (processed.has(candidate)) continue;
        const prereqs = (prereqMap.get(candidate) ?? []).filter((p) => skillSet.has(p));
        if (!prereqs.includes(current)) continue;

        // Actualizar el nivel topológico de T: es al menos currentLevel + 1
        const prevLevel = topoLevel.get(candidate) ?? 0;
        topoLevel.set(candidate, Math.max(prevLevel, currentLevel + 1));

        // Decrementar in-degree
        inDegree.set(candidate, inDegree.get(candidate)! - 1);
        if (inDegree.get(candidate)! === 0) {
          nextQueue.push(candidate);
        }
      }
    }

    queue = nextQueue;
  }

  // Añadir cualquier skill que no pudo procesar (ciclo o prerequisito fuera de la ruta)
  for (const id of skillIds) {
    if (!processed.has(id)) {
      topoLevel.set(id, 999);
      bfsOrder.push(id);
    }
  }

  // Ordenar resultado final: nivel topológico PRIMARIO, rawPriority DESC SECUNDARIO
  bfsOrder.sort((a, b) => {
    const levelDiff = (topoLevel.get(a) ?? 0) - (topoLevel.get(b) ?? 0);
    if (levelDiff !== 0) return levelDiff;
    return (priorityMap.get(b) ?? 0) - (priorityMap.get(a) ?? 0);
  });

  return bfsOrder;
}

// ─────────────────────────────────────────────────────────
// computeRoadmap() — función pública principal
// ─────────────────────────────────────────────────────────

/**
 * Computa el roadmap determinístico para un usuario dado.
 *
 * Función pura: mismos inputs → mismo output. Sin efectos secundarios.
 * Ejecuta en cliente (<1ms para el catálogo MVP de 18 skills).
 *
 * @param input - Ruta, catálogo de skills, DNA del usuario, y scores del GitHub Engine opcionales.
 * @returns Array ordenado de RoadmapItem con prerequisitos respetados y prioridad calculada.
 */
export function computeRoadmap(input: ComputeRoadmapInput): RoadmapItem[] {
  const { route, catalog, dna, githubScores } = input;
  const targetScore = SENIORITY_THRESHOLDS[route.toLevel];

  // Filtrar el catálogo a solo las skills que aparecen en esta ruta
  const routeSkillIds = new Set(Object.keys(route.skillWeights));
  const routeSkills = catalog.filter((skill) => routeSkillIds.has(skill.id));

  // Construir mapas de prerequisitos y dominio
  const prereqMap = new Map<string, string[]>();
  const dominated = new Set<string>();
  const scoreMap = new Map<string, { score: number; source: ScoreSource }>();

  for (const skill of routeSkills) {
    prereqMap.set(skill.id, skill.prerequisites);
    const resolved = resolveScore(skill, dna, githubScores);
    scoreMap.set(skill.id, resolved);
    if (resolved.score >= targetScore) {
      dominated.add(skill.id);
    }
  }

  // Calcular déficit y prioridad para cada skill
  const deficitMap = new Map<string, number>();
  const priorityMap = new Map<string, number>(); // valor numérico para ordenar

  for (const skill of routeSkills) {
    const { score } = scoreMap.get(skill.id)!;
    const weight = route.skillWeights[skill.id] ?? 0;
    const deficit = Math.max(0, targetScore - score);
    deficitMap.set(skill.id, deficit);
    priorityMap.set(skill.id, rawPriority(deficit, weight));
  }

  // Kahn's topological sort
  const allIds = routeSkills.map((s) => s.id);
  const sortedIds = kahnSort(allIds, prereqMap, priorityMap, dominated);

  // Construir RoadmapItem[] en el orden resultante
  const skillById = new Map<string, Skill>();
  for (const skill of routeSkills) skillById.set(skill.id, skill);

  const items: RoadmapItem[] = sortedIds.map((skillId, idx) => {
    const skill = skillById.get(skillId)!;
    const { score, source } = scoreMap.get(skillId)!;
    const weight = route.skillWeights[skillId] ?? 0;
    const deficit = deficitMap.get(skillId)!;
    const priority = calcPriority(deficit, weight);

    // Determinar status
    let status: RoadmapItemStatus;
    if (dominated.has(skillId)) {
      status = "completed";
    } else {
      const prereqs = prereqMap.get(skillId) ?? [];
      const hasBlockingPrereq = prereqs.some(
        (p) => routeSkillIds.has(p) && !dominated.has(p)
      );
      status = hasBlockingPrereq ? "blocked" : "gap";
    }

    // Prerequisitos que bloquean (solo los que están en la ruta y no son dominados)
    const blockedBy =
      status === "blocked"
        ? (prereqMap.get(skillId) ?? []).filter(
            (p) => routeSkillIds.has(p) && !dominated.has(p)
          )
        : [];

    return {
      skillId,
      skillName: skill.name,
      category: skill.category,
      status,
      priority,
      order: idx + 1,
      currentScore: score,
      targetScore,
      deficit,
      blockedBy,
      prerequisites: skill.prerequisites,
      scoreSource: source,
    };
  });

  return items;
}

// ─────────────────────────────────────────────────────────
// inferFromLevel — inferencia del nivel actual desde el DNA
// ─────────────────────────────────────────────────────────

/**
 * Infiere el nivel actual (`fromLevel`) del usuario basándose en su DNA técnico.
 * Usa SENIORITY_THRESHOLDS: el nivel es el más alto cuyos umbrales se cumplen.
 *
 * @param dna - Scores del usuario (user_skill_scores.scores).
 * @returns SeniorityLevel inferido ('junior' | 'mid' | 'senior').
 */
export function inferFromLevel(dna: Record<string, number>): "junior" | "mid" | "senior" {
  const scores = Object.values(dna);
  if (scores.length === 0) return "junior";

  const average = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (average >= SENIORITY_THRESHOLDS.senior) return "senior";
  if (average >= SENIORITY_THRESHOLDS.mid) return "mid";
  return "junior";
}
