/**
 * Catálogo canónico de tecnologías practicables en **The LINE general** (el modo libre, sin vacante).
 *
 * Es la lista maestra que usan tres sitios:
 *  - el selector de la UI (agrupado por categoría),
 *  - el script de precarga `scripts/seed-question-bank.ts`, que genera un repertorio por
 *    (tecnología × nivel),
 *  - `/api/line/start`, para validar que la tecnología pedida existe.
 *
 * Los `id` coinciden con las claves de `TECHNOLOGY_SOURCES` (`src/lib/server/sources.ts`), de modo
 * que cada tecnología resuelve sus fuentes de referencia sin tabla intermedia. Son también la clave
 * bajo la que se guarda el score en el DNA, así que van **en minúsculas** (invariante del match).
 *
 * Este archivo NO es server-only: la UI lo importa. No debe contener nada sensible.
 */

export const TECH_CATEGORIES = [
  "frontend",
  "backend",
  "languages",
  "mobile",
  "databases",
  "cloud",
  "devops",
  "api",
  "testing",
  "architecture",
] as const;

export type TechCategory = (typeof TECH_CATEGORIES)[number];

/** Etiqueta legible de cada categoría, para agrupar el selector. */
export const CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend y frameworks",
  languages: "Lenguajes",
  mobile: "Móvil",
  databases: "Bases de datos",
  cloud: "Cloud",
  devops: "DevOps e infraestructura",
  api: "APIs",
  testing: "Testing",
  architecture: "Arquitectura y seguridad",
};

export interface Technology {
  /** Clave estable: id del repertorio y clave del score en el DNA. Siempre en minúsculas. */
  id: string;
  /** Nombre mostrado en la UI. */
  label: string;
  category: TechCategory;
}

export const TECHNOLOGIES: Technology[] = [
  // Frontend
  { id: "react", label: "React", category: "frontend" },
  { id: "nextjs", label: "Next.js", category: "frontend" },
  { id: "angular", label: "Angular", category: "frontend" },
  { id: "vue", label: "Vue", category: "frontend" },
  { id: "svelte", label: "Svelte", category: "frontend" },
  { id: "javascript", label: "JavaScript", category: "frontend" },
  { id: "typescript", label: "TypeScript", category: "frontend" },
  { id: "css", label: "CSS", category: "frontend" },
  { id: "tailwind", label: "Tailwind CSS", category: "frontend" },

  // Backend y frameworks
  { id: "node.js", label: "Node.js", category: "backend" },
  { id: "express", label: "Express", category: "backend" },
  { id: "nestjs", label: "NestJS", category: "backend" },
  { id: "django", label: "Django", category: "backend" },
  { id: "fastapi", label: "FastAPI", category: "backend" },
  { id: "laravel", label: "Laravel", category: "backend" },
  { id: "asp.net", label: "ASP.NET Core", category: "backend" },
  { id: "spring", label: "Spring", category: "backend" },

  // Lenguajes
  { id: "python", label: "Python", category: "languages" },
  { id: "java", label: "Java", category: "languages" },
  { id: "dotnet", label: "C# / .NET", category: "languages" },
  { id: "go", label: "Go", category: "languages" },
  { id: "rust", label: "Rust", category: "languages" },
  { id: "php", label: "PHP", category: "languages" },
  { id: "kotlin", label: "Kotlin", category: "languages" },
  { id: "swift", label: "Swift", category: "languages" },
  { id: "c++", label: "C++", category: "languages" },

  // Móvil
  { id: "android", label: "Android", category: "mobile" },
  { id: "ios", label: "iOS", category: "mobile" },
  { id: "flutter", label: "Flutter", category: "mobile" },
  { id: "react native", label: "React Native", category: "mobile" },

  // Bases de datos
  { id: "postgresql", label: "PostgreSQL", category: "databases" },
  { id: "mysql", label: "MySQL", category: "databases" },
  { id: "sqlserver", label: "SQL Server", category: "databases" },
  { id: "mongodb", label: "MongoDB", category: "databases" },
  { id: "redis", label: "Redis", category: "databases" },
  { id: "elasticsearch", label: "Elasticsearch", category: "databases" },

  // Cloud
  { id: "aws", label: "AWS", category: "cloud" },
  { id: "azure", label: "Azure", category: "cloud" },
  { id: "gcp", label: "Google Cloud", category: "cloud" },

  // DevOps
  { id: "docker", label: "Docker", category: "devops" },
  { id: "kubernetes", label: "Kubernetes", category: "devops" },
  { id: "terraform", label: "Terraform", category: "devops" },
  { id: "git", label: "Git", category: "devops" },
  { id: "ci-cd", label: "CI/CD", category: "devops" },

  // APIs
  { id: "rest", label: "REST / OpenAPI", category: "api" },
  { id: "graphql", label: "GraphQL", category: "api" },
  { id: "grpc", label: "gRPC", category: "api" },

  // Testing
  { id: "testing", label: "Testing (general)", category: "testing" },
  { id: "jest", label: "Jest", category: "testing" },
  { id: "vitest", label: "Vitest", category: "testing" },
  { id: "playwright", label: "Playwright", category: "testing" },
  { id: "cypress", label: "Cypress", category: "testing" },

  // Arquitectura y seguridad
  { id: "microservices", label: "Microservicios", category: "architecture" },
  { id: "architecture", label: "Arquitectura de sistemas", category: "architecture" },
  { id: "security", label: "Seguridad (OWASP)", category: "architecture" },
];

const BY_ID = new Map(TECHNOLOGIES.map((t) => [t.id, t]));

/** Busca una tecnología por su id. `undefined` si no está en el catálogo. */
export function findTechnology(id: string | undefined | null): Technology | undefined {
  if (!id) return undefined;
  return BY_ID.get(String(id).trim().toLowerCase());
}

/** Tecnologías agrupadas por categoría, en el orden de `TECH_CATEGORIES`. */
export function technologiesByCategory(): { category: TechCategory; items: Technology[] }[] {
  return TECH_CATEGORIES.map((category) => ({
    category,
    items: TECHNOLOGIES.filter((t) => t.category === category),
  })).filter((group) => group.items.length > 0);
}
