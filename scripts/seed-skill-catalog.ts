/**
 * Precarga el **Skill Catalog** y las **Roadmap Routes** en Firestore.
 *
 * Escribe en:
 *   - `skill_catalog/{skillId}`    — Catálogo curado de skills (18 skills para MVP Backend)
 *   - `roadmap_routes/{routeId}`   — Rutas de progresión (backend_junior_to_mid para MVP)
 *
 * ── Cómo se ejecuta ─────────────────────────────────────────────────────────────────────────
 *   npm run seed:catalog -- --dry-run          # muestra plan, no escribe nada
 *   npm run seed:catalog -- --yes              # escribe en Firestore (PRODUCCIÓN)
 *   npm run seed:catalog -- --force --yes      # sobreescribe documentos existentes
 *
 * Requiere en `.env.local`:
 *   FIREBASE_SERVICE_ACCOUNT   JSON del service account en una variable
 *   (o GOOGLE_APPLICATION_CREDENTIALS   ruta al JSON)
 *
 * ⚠️ Escribe en el Firestore del proyecto configurado — normalmente PRODUCCIÓN.
 *    Es reanudable: por defecto salta documentos ya existentes (usa --force para regenerar).
 *
 * Patrón: igual que scripts/seed-question-bank.ts (Admin SDK, --dry-run, --yes, --force).
 */

// ⚠️ PRIMER import: carga .env.local antes de que cualquier módulo lea process.env
import "./load-env";

import { initializeApp, getApps, cert, applicationDefault, deleteApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";
import type { Skill, RoadmapRoute } from "@/types/roadmap.types";

// ─────────────────────────────────────────────────────────
// Catálogo de skills — Backend Junior→Mid (18 skills)
// Definición de acuerdo con docs/ROADMAP_DETERMINISTIC.md §3
// ─────────────────────────────────────────────────────────

const SKILL_CATALOG: Omit<Skill, "relatedSkills">[] = [
  {
    id: "git-fundamentals",
    name: "Git & Control de Versiones",
    category: "tooling",
    githubDimension: null,
    prerequisites: [],
  },
  {
    id: "node-runtime",
    name: "Node.js Runtime & Event Loop",
    category: "language",
    githubDimension: "architecture",
    prerequisites: [],
  },
  {
    id: "typescript-basics",
    name: "TypeScript Fundamentals",
    category: "language",
    githubDimension: "architecture",
    prerequisites: [],
  },
  {
    id: "sql-fundamentals",
    name: "SQL & Álgebra Relacional",
    category: "database",
    githubDimension: null,
    prerequisites: [],
  },
  {
    id: "http-protocol",
    name: "HTTP/HTTPS & Protocolo REST",
    category: "api-design",
    githubDimension: null,
    prerequisites: [],
  },
  {
    id: "unit-testing",
    name: "Unit Testing",
    category: "testing",
    githubDimension: "testing",
    prerequisites: ["typescript-basics"],
  },
  {
    id: "api-design-rest",
    name: "Diseño de APIs REST",
    category: "api-design",
    githubDimension: "architecture",
    prerequisites: ["http-protocol", "typescript-basics"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL & Consultas Avanzadas",
    category: "database",
    githubDimension: null,
    prerequisites: ["sql-fundamentals"],
  },
  {
    id: "orm-basics",
    name: "ORM (Prisma / TypeORM)",
    category: "database",
    githubDimension: null,
    prerequisites: ["postgresql", "typescript-basics"],
  },
  {
    id: "auth-jwt",
    name: "Autenticación JWT & Sesiones",
    category: "security",
    githubDimension: "security",
    prerequisites: ["http-protocol", "api-design-rest"],
  },
  {
    id: "error-handling",
    name: "Manejo de Errores & Logging",
    category: "tooling",
    githubDimension: "maintainability",
    prerequisites: ["typescript-basics"],
  },
  {
    id: "integration-testing",
    name: "Integration Testing & Mocks",
    category: "testing",
    githubDimension: "testing",
    prerequisites: ["unit-testing", "api-design-rest"],
  },
  {
    id: "environment-config",
    name: "Variables de Entorno & Config",
    category: "tooling",
    githubDimension: null,
    prerequisites: ["node-runtime"],
  },
  {
    id: "docker-basics",
    name: "Docker & Contenedores",
    category: "infrastructure",
    githubDimension: null,
    prerequisites: ["environment-config"],
  },
  {
    id: "async-patterns",
    name: "Async/Await & Concurrencia",
    category: "language",
    githubDimension: "architecture",
    prerequisites: ["node-runtime", "typescript-basics"],
  },
  {
    id: "api-validation",
    name: "Validación de Input (Zod / Joi)",
    category: "api-design",
    githubDimension: "security",
    prerequisites: ["api-design-rest"],
  },
  {
    id: "code-documentation",
    name: "Documentación de Código & OpenAPI",
    category: "tooling",
    githubDimension: "documentation",
    prerequisites: ["api-design-rest"],
  },
  {
    id: "basic-security",
    name: "OWASP Top 10 & SQL Injection",
    category: "security",
    githubDimension: "security",
    prerequisites: ["auth-jwt", "api-validation"],
  },
];

// ─────────────────────────────────────────────────────────
// Ruta backend_junior_to_mid
// Pesos del doc §4.3 — suma = 1.00
// ─────────────────────────────────────────────────────────

const BACKEND_JUNIOR_TO_MID: Omit<RoadmapRoute, never> = {
  id: "backend_junior_to_mid",
  targetRole: "backend",
  fromLevel: "junior",
  toLevel: "mid",
  displayName: "Backend Engineer · Junior → Mid",
  skillWeights: {
    "api-design-rest": 0.12,
    postgresql: 0.10,
    "unit-testing": 0.09,
    "auth-jwt": 0.08,
    "async-patterns": 0.08,
    "integration-testing": 0.07,
    "typescript-basics": 0.07,
    "orm-basics": 0.06,
    "basic-security": 0.06,
    "api-validation": 0.05,
    "docker-basics": 0.05,
    "node-runtime": 0.04,
    "error-handling": 0.04,
    "environment-config": 0.02,
    "sql-fundamentals": 0.02,
    "http-protocol": 0.02,
    "code-documentation": 0.02,
    "git-fundamentals": 0.01,
  },
};

const SKILL_CATALOG_COLLECTION = "skill_catalog";
const ROUTES_COLLECTION = "roadmap_routes";
const SEEDER_VERSION = "seed-skill-catalog@v1";

// ─────────────────────────────────────────────────────────
// Args
// ─────────────────────────────────────────────────────────

function parseArgs(argv: string[]) {
  const has = (name: string) => argv.includes(`--${name}`);
  return {
    dryRun: has("dry-run"),
    confirmed: has("yes"),
    force: has("force"),
  };
}

// ─────────────────────────────────────────────────────────
// Firestore
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

async function docExists(db: Firestore, collection: string, id: string): Promise<boolean> {
  const snap = await db.collection(collection).doc(id).get();
  return snap.exists;
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  // Validar que los pesos de la ruta sumen 1.00 (tolerancia 0.001)
  const totalWeight = Object.values(BACKEND_JUNIOR_TO_MID.skillWeights).reduce((a, b) => a + b, 0);
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    console.error(`❌ Los pesos de backend_junior_to_mid NO suman 1.0 (suman ${totalWeight.toFixed(4)})`);
    process.exit(1);
  }

  // Verificar que todos los skillIds del route.skillWeights existen en el catálogo
  const catalogIds = new Set(SKILL_CATALOG.map((s) => s.id));
  const missingInCatalog = Object.keys(BACKEND_JUNIOR_TO_MID.skillWeights).filter(
    (id) => !catalogIds.has(id)
  );
  if (missingInCatalog.length > 0) {
    console.error(`❌ skillWeights referencia IDs no presentes en el catálogo: ${missingInCatalog.join(", ")}`);
    process.exit(1);
  }

  // Verificar integridad de prerequisitos (que todos los IDs de prereqs existan en el catálogo)
  const prereqErrors: string[] = [];
  for (const skill of SKILL_CATALOG) {
    for (const prereq of skill.prerequisites) {
      if (!catalogIds.has(prereq)) {
        prereqErrors.push(`  "${skill.id}" → prerequisito "${prereq}" no existe en el catálogo`);
      }
    }
  }
  if (prereqErrors.length > 0) {
    console.error("❌ Prerequisitos con referencias rotas:");
    prereqErrors.forEach((e) => console.error(e));
    process.exit(1);
  }

  console.log("\n📋 PLAN DE SEED — Skill Catalog & Roadmap Routes");
  console.log("─".repeat(60));
  console.log(`Skills a cargar : ${SKILL_CATALOG.length}`);
  console.log(`Rutas a cargar  : 1 (backend_junior_to_mid)`);
  console.log(`Peso total ruta : ${totalWeight.toFixed(4)} ✅`);
  console.log(`Sobreescribir   : ${opts.force ? "SÍ (--force)" : "no"}`);
  console.log("─".repeat(60));
  console.log("\nSkills:");
  for (const skill of SKILL_CATALOG) {
    const prereqStr = skill.prerequisites.length > 0
      ? ` ← [${skill.prerequisites.join(", ")}]`
      : " (raíz)";
    const dimStr = skill.githubDimension ? ` [${skill.githubDimension}]` : " [null]";
    console.log(`  ${skill.id.padEnd(22)} ${skill.category.padEnd(14)}${dimStr}${prereqStr}`);
  }
  console.log("");

  if (opts.dryRun) {
    console.log("🔍 --dry-run: no se ha escrito nada. Quita --dry-run y añade --yes para ejecutar.\n");
    return;
  }

  if (!opts.confirmed) {
    console.error("⚠️  Esto escribe en el Firestore del proyecto configurado (probablemente PRODUCCIÓN).");
    console.error("   Revisa el plan de arriba y vuelve a lanzarlo con --yes para confirmar.\n");
    process.exit(1);
  }

  const db = initFirestore();

  let skillsCreated = 0;
  let skillsSkipped = 0;
  let routesCreated = 0;
  let routesSkipped = 0;

  // ── Seed skill_catalog ──
  console.log("\n🗂️  Cargando skill_catalog...");
  for (const [i, skill] of SKILL_CATALOG.entries()) {
    const progress = `[${i + 1}/${SKILL_CATALOG.length}]`;
    try {
      if (!opts.force) {
        const exists = await docExists(db, SKILL_CATALOG_COLLECTION, skill.id);
        if (exists) {
          console.log(`${progress} ⏭️  skill_catalog/${skill.id} — ya existe, saltando`);
          skillsSkipped++;
          continue;
        }
      }

      await db.collection(SKILL_CATALOG_COLLECTION).doc(skill.id).set({
        ...skill,
        seeder: SEEDER_VERSION,
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`${progress} ✅ skill_catalog/${skill.id}`);
      skillsCreated++;
    } catch (err) {
      console.error(`${progress} ❌ skill_catalog/${skill.id} —`, err instanceof Error ? err.message : err);
    }
  }

  // ── Seed roadmap_routes ──
  console.log("\n🗺️  Cargando roadmap_routes...");
  const route = BACKEND_JUNIOR_TO_MID;
  try {
    if (!opts.force) {
      const exists = await docExists(db, ROUTES_COLLECTION, route.id);
      if (exists) {
        console.log(`⏭️  roadmap_routes/${route.id} — ya existe, saltando`);
        routesSkipped++;
      } else {
        await db.collection(ROUTES_COLLECTION).doc(route.id).set({
          ...route,
          seeder: SEEDER_VERSION,
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`✅ roadmap_routes/${route.id}`);
        routesCreated++;
      }
    } else {
      await db.collection(ROUTES_COLLECTION).doc(route.id).set({
        ...route,
        seeder: SEEDER_VERSION,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`✅ roadmap_routes/${route.id} (--force)`);
      routesCreated++;
    }
  } catch (err) {
    console.error(`❌ roadmap_routes/${route.id} —`, err instanceof Error ? err.message : err);
  }

  console.log("\n" + "─".repeat(60));
  console.log("🎉 SEED TERMINADO");
  console.log(`   Skills creadas   : ${skillsCreated}`);
  console.log(`   Skills saltadas  : ${skillsSkipped}`);
  console.log(`   Rutas creadas    : ${routesCreated}`);
  console.log(`   Rutas saltadas   : ${routesSkipped}`);
  console.log("─".repeat(60) + "\n");
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
