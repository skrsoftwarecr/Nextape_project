/**
 * Verificación de punta a punta de computeRoadmap().
 *
 * Carga skill_catalog y roadmap_routes desde Firestore real,
 * simula un usuario con scores mixtos (sin escribir nada en Firestore)
 * y reporta el RoadmapItem[] completo con todas las invariantes.
 *
 * Ejecutar con:
 *   node -r tsconfig-paths/register --loader ts-node/esm scripts/verify-roadmap-engine.ts
 * o bien:
 *   tsx scripts/verify-roadmap-engine.ts
 */

import "./load-env";

import { initializeApp, getApps, cert, applicationDefault, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";

import { computeRoadmap, inferFromLevel } from "@/lib/roadmap-engine";
import { SENIORITY_THRESHOLDS } from "@/services/github-engine/role-mapping/role-weights";
import type { Skill, RoadmapRoute, RoadmapItem } from "@/types/roadmap.types";

// ─────────────────────────────────────────────────────────
// Input sintético realista (sin escribir nada en Firestore)
// ─────────────────────────────────────────────────────────

/**
 * Simula un usuario Junior real con:
 * - typescript-basics: 80 (dominado, score ≥ 70)
 * - unit-testing: 65     (gap real: debajo de 70)
 * - node-runtime: 72     (dominado)
 * - api-design-rest: 40  (gap crítico: 70 - 40 = 30 déficit × 0.12 peso)
 * - http-protocol: 75    (dominado)
 * - sql-fundamentals: 55 (gap, pero tiene señal directa de The LINE)
 *   (NO usa GitHub Engine como proxy: tiene señal directa de The LINE)
 * - Resto: sin datos (score 0, sin proxy de GitHub Engine tampoco)
 */
const MOCK_DNA: Record<string, number> = {
  "typescript-basics": 80,
  "unit-testing": 65,
  "node-runtime": 72,
  "api-design-rest": 40,
  "http-protocol": 75,
  "sql-fundamentals": 55,
  // SIN: docker-basics, postgresql, orm-basics, auth-jwt, etc.
  // SIN: async-patterns, integration-testing, basic-security, etc.
};

/**
 * Simula la evidencia del GitHub Engine (opcional):
 * - testing: 60   → proxy para unit-testing / integration-testing si no hay señal The LINE directa
 * - architecture: 70 → proxy para node-runtime, typescript-basics, api-design-rest, async-patterns
 * - security: null → sin AST data para repo del usuario
 * - maintainability: 55
 * - documentation: 45
 *
 * El motor debe preferir The LINE cuando hay señal directa.
 */
const MOCK_GITHUB_SCORES = {
  architecture: 70,
  testing: 60,
  security: null,
  maintainability: 55,
  documentation: 45,
};

// ─────────────────────────────────────────────────────────
// Firebase Admin
// ─────────────────────────────────────────────────────────

function initFirestore(): Firestore {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    initializeApp(
      raw ? { credential: cert(JSON.parse(raw)) } : { credential: applicationDefault() }
    );
  }
  return getFirestore();
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

async function main() {
  const db = initFirestore();

  // 1. Cargar ruta desde Firestore
  console.log("\n── CARGANDO DATOS DE FIRESTORE ──────────────────────────\n");
  const routeSnap = await db.collection("roadmap_routes").doc("backend_junior_to_mid").get();
  if (!routeSnap.exists) {
    console.error("❌ roadmap_routes/backend_junior_to_mid no existe en Firestore");
    process.exit(1);
  }
  const route = routeSnap.data() as RoadmapRoute;
  console.log(`✅ roadmap_routes/${route.id} — ${route.displayName}`);
  console.log(`   targetRole: ${route.targetRole}, ${route.fromLevel} → ${route.toLevel}`);
  console.log(`   skillWeights entries: ${Object.keys(route.skillWeights).length}`);

  // 2. Cargar skills del catálogo
  const skillIds = Object.keys(route.skillWeights);
  const skillDocs = await Promise.all(
    skillIds.map((id) => db.collection("skill_catalog").doc(id).get())
  );
  const catalog = skillDocs
    .filter((d) => d.exists)
    .map((d) => ({ id: d.id, ...d.data() } as Skill));
  console.log(`✅ skill_catalog: ${catalog.length} skills cargadas`);

  if (catalog.length < skillIds.length) {
    const missingIds = skillIds.filter((id) => !catalog.find((s) => s.id === id));
    console.warn(`⚠️ Skills no encontradas en catálogo: ${missingIds.join(", ")}`);
  }

  // 3. Mostrar input del usuario
  console.log("\n── INPUT DEL USUARIO ────────────────────────────────────\n");
  console.log("DNA (user_skill_scores, The LINE — fuente primaria):");
  for (const [skill, score] of Object.entries(MOCK_DNA)) {
    const dominated = score >= SENIORITY_THRESHOLDS.mid;
    console.log(`   ${skill.padEnd(24)} = ${String(score).padStart(3)}%  ${dominated ? "✅ DOMINADO" : "⬜ gap"}`);
  }
  console.log("\nGitHub Engine scores (proxy secundario):");
  for (const [dim, score] of Object.entries(MOCK_GITHUB_SCORES)) {
    console.log(`   ${dim.padEnd(16)} = ${score === null ? "null (sin AST)" : String(score) + "%"}`);
  }

  // 4. Inferir nivel
  const inferredLevel = inferFromLevel(MOCK_DNA);
  const avgScore =
    Object.values(MOCK_DNA).reduce((a, b) => a + b, 0) / Object.values(MOCK_DNA).length;
  console.log(`\n── INFERENCIA DE NIVEL ─────────────────────────────────\n`);
  console.log(`   Promedio de scores DNA: ${avgScore.toFixed(1)}%`);
  console.log(`   SENIORITY_THRESHOLDS: junior=50, mid=70, senior=85`);
  console.log(`   inferFromLevel() → "${inferredLevel}"`);
  console.log(
    `   Esperado: "junior" (promedio ${avgScore.toFixed(1)} < 70) → ${inferredLevel === "junior" ? "✅ CORRECTO" : "❌ INCORRECTO"}`
  );

  // 5. Ejecutar computeRoadmap()
  console.log("\n── EJECUTANDO computeRoadmap() ─────────────────────────\n");
  const targetScore = SENIORITY_THRESHOLDS[route.toLevel];
  console.log(`   targetScore (mid): ${targetScore}%`);

  const items: RoadmapItem[] = computeRoadmap({
    route,
    catalog,
    dna: MOCK_DNA,
    githubScores: MOCK_GITHUB_SCORES,
  });

  // 6. Output completo de RoadmapItem[]
  console.log(`\n── RESULTADO COMPLETO: ${items.length} RoadmapItems ──────────────────\n`);
  console.log(
    "ORD | skillId                 | status    | priority | curScore | tgtScore | deficit | source  | blockedBy"
  );
  console.log("─".repeat(115));
  for (const item of items) {
    const row = [
      String(item.order).padStart(3),
      item.skillId.padEnd(24),
      item.status.padEnd(9),
      item.priority.padEnd(8),
      String(item.currentScore).padStart(8) + "%",
      String(item.targetScore).padStart(8) + "%",
      String(item.deficit).padStart(7) + "%",
      item.scoreSource.padEnd(7),
      item.blockedBy.length > 0 ? item.blockedBy.join(", ") : "—",
    ].join(" | ");
    console.log(row);
  }

  // 7. JSON completo (sin omitir ningún campo)
  console.log("\n── JSON COMPLETO ────────────────────────────────────────\n");
  console.log(JSON.stringify(items, null, 2));

  // 8. Verificación de invariantes
  console.log("\n── VERIFICACIÓN DE INVARIANTES ─────────────────────────\n");

  // 8a. Invariante dura: prerequisitos siempre ANTES de sus dependientes
  const orderIndex = new Map<string, number>();
  for (const item of items) orderIndex.set(item.skillId, item.order);

  let prereqViolations = 0;
  for (const item of items) {
    for (const prereq of item.prerequisites) {
      const prereqOrder = orderIndex.get(prereq);
      if (prereqOrder === undefined) continue; // prereq fuera de la ruta, ok
      if (prereqOrder > item.order) {
        console.error(
          `❌ VIOLACIÓN DE PREREQUISITO: "${item.skillId}" (orden ${item.order}) aparece ANTES que su prereq "${prereq}" (orden ${prereqOrder})`
        );
        prereqViolations++;
      }
    }
  }
  if (prereqViolations === 0) {
    console.log(`✅ a. Orden topológico correcto — ningún prerequisito aparece DESPUÉS de su dependiente (${items.filter(i => i.prerequisites.length > 0).length} skills con prereqs verificadas)`);
  }

  // 8b. Coherencia status/score
  let statusIncoherences = 0;
  for (const item of items) {
    const dominated = item.currentScore >= item.targetScore;
    if (dominated && item.status !== "completed") {
      console.error(`❌ INCOHERENCIA STATUS: "${item.skillId}" score=${item.currentScore} >= ${item.targetScore} pero status="${item.status}" (debería ser "completed")`);
      statusIncoherences++;
    }
    if (!dominated && item.status === "completed") {
      console.error(`❌ INCOHERENCIA STATUS: "${item.skillId}" score=${item.currentScore} < ${item.targetScore} pero status="completed"`);
      statusIncoherences++;
    }
    // Verificar 'blocked' vs 'gap'
    if (item.status === "blocked" && item.blockedBy.length === 0) {
      console.error(`❌ INCOHERENCIA: "${item.skillId}" status=blocked pero blockedBy=[] (vacío)`);
      statusIncoherences++;
    }
    if (item.status === "gap" && item.blockedBy.length > 0) {
      console.error(`❌ INCOHERENCIA: "${item.skillId}" status=gap pero blockedBy=${JSON.stringify(item.blockedBy)} (no vacío)`);
      statusIncoherences++;
    }
  }
  if (statusIncoherences === 0) {
    console.log(`✅ b. Status coherentes con scores de entrada — todas las ${items.length} skills correctamente clasificadas`);
  }

  // 8c. Skills sin githubDimension no heredan score del Engine cuando no tienen señal The LINE
  const nullDimSkillsWithoutLine = catalog.filter(
    (s) =>
      s.githubDimension === null &&
      MOCK_DNA[s.id] === undefined
  );
  let ghostScoreCount = 0;
  for (const skill of nullDimSkillsWithoutLine) {
    const item = items.find((i) => i.skillId === skill.id);
    if (!item) continue;
    if (item.currentScore !== 0 || item.scoreSource !== "none") {
      console.error(
        `❌ SCORE INFLADO: "${skill.id}" tiene githubDimension=null y sin señal The LINE, pero currentScore=${item.currentScore} (scoreSource="${item.scoreSource}") — debería ser score=0, source="none"`
      );
      ghostScoreCount++;
    }
  }
  const nullDimNoLineCount = nullDimSkillsWithoutLine.length;
  if (ghostScoreCount === 0) {
    console.log(
      `✅ c. ${nullDimNoLineCount} skills con githubDimension=null y sin señal The LINE → todas con score=0, source="none" (no hay inflación)`
    );
    // Mostrar ejemplos concretos
    for (const skill of nullDimSkillsWithoutLine.slice(0, 3)) {
      const item = items.find((i) => i.skillId === skill.id);
      if (item) {
        console.log(`   "${skill.id}": score=${item.currentScore}, source="${item.scoreSource}" ✅`);
      }
    }
  }

  // 8d. Verificar que The LINE tiene prioridad sobre GitHub Engine
  const lineOverGithubChecks: string[] = [];
  for (const item of items) {
    if (MOCK_DNA[item.skillId] !== undefined && item.scoreSource !== "line") {
      lineOverGithubChecks.push(
        `❌ "${item.skillId}" tiene score The LINE (${MOCK_DNA[item.skillId]}) pero scoreSource="${item.scoreSource}"`
      );
    }
  }
  if (lineOverGithubChecks.length === 0) {
    const skillsWithDirectLine = items.filter((i) => MOCK_DNA[i.skillId] !== undefined);
    console.log(`✅ d. The LINE tiene prioridad sobre GitHub Engine en ${skillsWithDirectLine.length} skills con señal directa`);
    for (const item of skillsWithDirectLine) {
      console.log(`   "${item.skillId}": score=${item.currentScore} (The LINE=${MOCK_DNA[item.skillId]}), source="${item.scoreSource}" ✅`);
    }
  } else {
    lineOverGithubChecks.forEach((e) => console.error(e));
  }

  // 8e. Verificar inferFromLevel
  const allViolations = prereqViolations + statusIncoherences + ghostScoreCount + lineOverGithubChecks.length;
  console.log(`\n── RESUMEN FINAL ────────────────────────────────────────\n`);
  console.log(`   Total items: ${items.length}`);
  console.log(`   Completed:   ${items.filter((i) => i.status === "completed").length}`);
  console.log(`   Gap:         ${items.filter((i) => i.status === "gap").length}`);
  console.log(`   Blocked:     ${items.filter((i) => i.status === "blocked").length}`);
  console.log(`   Critical:    ${items.filter((i) => i.priority === "critical").length}`);
  console.log(`   High:        ${items.filter((i) => i.priority === "high").length}`);
  console.log(`   Medium:      ${items.filter((i) => i.priority === "medium").length}`);
  console.log(`   Low:         ${items.filter((i) => i.priority === "low").length}`);
  console.log(`\n   Violaciones de invariantes: ${allViolations === 0 ? "NINGUNA ✅" : allViolations + " ❌"}`);
}

main()
  .then(async () => {
    await Promise.all(getApps().map((app) => deleteApp(app)));
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Error fatal:", err);
    process.exit(1);
  });
