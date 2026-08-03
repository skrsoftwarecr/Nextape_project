import type { BankQuestion } from "@/types/question.types";
import type { Question } from "@/types/job.types";
import { adminDb } from "@/lib/firebase/admin";

/**
 * Banco Inicial de Preguntas Pre-Aprobadas (Seed / Fallback Offline).
 * Todos los escenarios miden criterio profesional real (arquitectura, rendimiento, seguridad, refactorización, depuración)
 * sin preguntas de memorización sintáctica.
 */
export const INITIAL_QUESTION_BANK: BankQuestion[] = [
  // --- FRONTEND / REACT / NEXTJS / TYPESCRIPT / TAILWIND ---
  {
    id: "q-react-arch-01",
    skill: "react",
    level: "senior",
    category: "architecture",
    tag: "react",
    briefing: "Una aplicación React de gran escala experimenta degradación de rendimiento por re-renders masivos en el árbol de componentes.",
    text: "¿Cuál es la estrategia arquitectónica óptima para desacoplar el estado global y evitar re-renders innecesarios?",
    options: [
      "Subdividir el estado en contextos atómicos o selectores finos (e.g., Zustand/Jotai) en lugar de un único contexto monolítico",
      "Envolver todos los componentes del sistema con React.memo y omitir las dependencias de useCallback",
      "Reemplazar el estado de React con variables globales mutables fuera del ciclo de vida de React",
      "Consumir todo el estado mediante un custom hook en el root layout sin memorización"
    ],
    correctIndex: 0,
    difficultyScore: 0.8,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-nextjs-perf-01",
    skill: "nextjs",
    level: "senior",
    category: "performance",
    tag: "nextjs",
    briefing: "Un sitio en Next.js (App Router) presenta un tiempo TTFB (Time to First Byte) elevado en rutas dinámicas.",
    text: "¿Qué técnica de ingeniería soluciona este cuello de botella permitiendo renderizar la cáscara del UI de inmediato?",
    options: [
      "Implementar Streaming con React Suspense y PPR (Partial Prerendering) para diferir bloques lentos de datos",
      "Convertir todos los Server Components a Client Components con useEffect",
      "Aumentar la memoria del servidor de Node.js sin modificar la estrategia de renderizado",
      "Mover las consultas a la base de datos dentro del middleware de Next.js"
    ],
    correctIndex: 0,
    difficultyScore: 0.85,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-ts-type-01",
    skill: "typescript",
    level: "senior",
    category: "refactoring",
    tag: "typescript",
    briefing: "Un módulo compartido utiliza tipos 'any' excesivos en handlers dinámicos, perdiendo la seguridad de tipos.",
    text: "¿Cuál es el enfoque correcto para modelar payloads dinámicos garantizando type-safety en tiempo de compilación?",
    options: [
      "Utilizar Tipos Genéricos Restringidos (Generic Constraints) combinados con Type Guards y 'unknown'",
      "Castear explícitamente todas las variables con 'as unknown as targetType' en cada invocación",
      "Desactivar 'strict: true' en tsconfig.json para permitir inferencias implícitas",
      "Reemplazar las interfaces con declaraciones globales en un archivo ambient d.ts"
    ],
    correctIndex: 0,
    difficultyScore: 0.75,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-tailwind-css-01",
    skill: "tailwind",
    level: "senior",
    category: "architecture",
    tag: "tailwind",
    briefing: "Un sistema de diseño en Tailwind CSS sufre de colisiones de clases dinámicas al componer variantes de componentes.",
    text: "¿Cómo se resuelve de forma limpia la especificidad y la fusión de clases dinámicas en TypeScript?",
    options: [
      "Combinar `clsx` (o `clsx/lite`) con `tailwind-merge` para resolver conflictos de utilidades en runtime",
      "Escribir reglas CSS personalizadas con `!important` para cada variante dinámica",
      "Concatenar strings de clases utilizando plantillas de texto sin deduplicación",
      "Inyectar estilos inline directamente en el atributo `style` de React"
    ],
    correctIndex: 0,
    difficultyScore: 0.7,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-react-debug-01",
    skill: "react",
    level: "mid",
    category: "debugging",
    tag: "react",
    briefing: "Un hook personalizado que efectúa peticiones HTTP genera fugas de memoria y llamadas duplicadas al desmontarse el componente.",
    text: "¿Qué mecanismo debe incluirse en la función de limpieza del efecto para cancelar la petición pendiente?",
    options: [
      "Instanciar un `AbortController` y ejecutar `controller.abort()` en el retorno del efecto",
      "Establecer la respuesta HTTP a null antes de desmontar el componente",
      "Llamar a `window.stop()` dentro del bloque catch de la promesa",
      "Remover el array de dependencias para que el efecto se ejecute en cada render"
    ],
    correctIndex: 0,
    difficultyScore: 0.65,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },

  // --- BACKEND / NODE.JS / POSTGRESQL / DOCKER / REDIS ---
  {
    id: "q-node-perf-01",
    skill: "node.js",
    level: "senior",
    category: "performance",
    tag: "node.js",
    briefing: "Una API REST en Node.js colapsa bajo alta concurrencia debido a operaciones síncronas pesadas que bloquean el Event Loop.",
    text: "¿Cuál es la arquitectura recomendada para delegar tareas intensivas en CPU sin congelar el loop principal?",
    options: [
      "Migrar el procesamiento pesado a Worker Threads o una cola de tareas asíncrona (e.g., BullMQ / Redis)",
      "Incrementar el número de listeners del Event Emitter global en el servidor HTTP",
      "Envolver el código síncrono en un bloque Promise.resolve()",
      "Aumentar el valor de ulimit en el sistema operativo del servidor"
    ],
    correctIndex: 0,
    difficultyScore: 0.85,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-pg-sec-01",
    skill: "postgresql",
    level: "senior",
    category: "security",
    tag: "postgresql",
    briefing: "Una consulta SQL crítica presenta problemas de rendimiento e inyección por concatenación dinámica de tablas masivas.",
    text: "¿Qué técnica de PostgreSQL garantiza aislamiento de datos, prevención de SQLi y consultas optimizadas?",
    options: [
      "Consultas preparadas con parámetros tipados (`$1, $2`) e índices B-Tree / BRIN adecuados",
      "Ejecutar `EXECUTE` con cadenas concatenadas previa limpieza con expresiones regulares",
      "Desactivar las restricciones de clave foránea durante las transacciones",
      "Otorgar permisos de SUPERUSER al usuario de la aplicación en la base de datos"
    ],
    correctIndex: 0,
    difficultyScore: 0.8,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-docker-arch-01",
    skill: "docker",
    level: "senior",
    category: "architecture",
    tag: "docker",
    briefing: "Una imagen de Docker para una aplicación Node.js pesa más de 1.5 GB y contiene herramientas de compilación no requeridas en producción.",
    text: "¿Cómo se optimiza la seguridad y el tamaño de la imagen de producción?",
    options: [
      "Implementar un Multi-Stage Build usando imágenes base Alpine/Distroless y copiando solo artifacts compilados",
      "Comprimir el directorio node_modules en un archivo zip dentro del contenedor",
      "Ejecutar `npm install --force` en la capa final de la imagen",
      "Eliminar el archivo Dockerignore para incluir las variables de entorno locales"
    ],
    correctIndex: 0,
    difficultyScore: 0.75,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-redis-arch-01",
    skill: "redis",
    level: "senior",
    category: "performance",
    tag: "redis",
    briefing: "Un sistema de caché con Redis sufre de 'Cache Stampede' (avalancha de peticiones a la DB) al expirar la clave de mayor tráfico.",
    text: "¿Qué patrón de diseño previene que la base de datos colapse al expirar la caché?",
    options: [
      "Implementar Mutex Locking (distribuido) o actualización anticipada asíncrona (Probabilistic Early Expiration)",
      "Aumentar el TTL de todas las claves a tiempo indeterminado",
      "Reiniciar el cluster de Redis automáticamente mediante un script de cron",
      "Desactivar la evicción de claves en redis.conf"
    ],
    correctIndex: 0,
    difficultyScore: 0.85,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },

  // --- DEVOPS / KUBERNETES / CI-CD / AWS / TERRAFORM ---
  {
    id: "q-k8s-arch-01",
    skill: "kubernetes",
    level: "senior",
    category: "architecture",
    tag: "kubernetes",
    briefing: "Un deployment en Kubernetes experimenta desbalanceso de carga y reinicios abruptos (`OOMKilled`) bajo picos de demanda.",
    text: "¿Cómo se debe configurar la especificación del Pod para garantizar estabilidad en el cluster?",
    options: [
      "Establecer `resources.requests` y `limits` adecuados de CPU/Memory junto con Liveness y Readiness Probes",
      "Eliminar los límites de memoria para permitir consumo ilimitado del nodo",
      "Aumentar únicamente la réplica estática sin configurar HPA (Horizontal Pod Autoscaler)",
      "Ejecutar los contenedores con privilegio `privileged: true`"
    ],
    correctIndex: 0,
    difficultyScore: 0.8,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-cicd-sec-01",
    skill: "ci-cd",
    level: "senior",
    category: "security",
    tag: "ci-cd",
    briefing: "Un pipeline de GitHub Actions necesita desplegar infraestructura en la nube sin exponer credenciales estáticas de larga duración.",
    text: "¿Cuál es la práctica de seguridad recomendada para autenticar el pipeline contra el proveedor cloud?",
    options: [
      "Utilizar OIDC (OpenID Connect) federado con roles de IAM efímeros y sin secretos guardados",
      "Guardar las claves `AWS_ACCESS_KEY_ID` en texto plano dentro del código del workflow",
      "Permitir el acceso anónimo al API endpoint de despliegue",
      "Commitear el archivo de credenciales cifrado en el repositorio git"
    ],
    correctIndex: 0,
    difficultyScore: 0.85,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-tf-arch-01",
    skill: "terraform",
    level: "senior",
    category: "architecture",
    tag: "terraform",
    briefing: "Múltiples ingenieros modifican la infraestructura con Terraform simultáneamente, generando colisiones en el estado (`tfstate`).",
    text: "¿Cuál es el patrón correcto para gestionar el estado de Terraform en equipos distribuidos?",
    options: [
      "Utilizar un Backend Remoto (e.g. AWS S3 + DynamoDB o Terraform Cloud) con bloqueo de estado (State Locking)",
      "Guardar el archivo `terraform.tfstate` en la raíz del repositorio de Git",
      "Desactivar la verificación de cambios antes de ejecutar `terraform apply`",
      "Ejecutar `terraform refresh` manualmente después de cada cambio en consola"
    ],
    correctIndex: 0,
    difficultyScore: 0.8,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  },
  {
    id: "q-aws-sec-01",
    skill: "aws",
    level: "senior",
    category: "security",
    tag: "aws",
    briefing: "Una aplicación alojada en EC2 necesita acceder de forma segura a un bucket de S3 sin hardcodear credenciales.",
    text: "¿Qué servicio o característica de AWS debe aplicarse a la instancia?",
    options: [
      "Asignar un Rol de IAM de EC2 (Instance Profile) con políticas de mínimo privilegio",
      "Generar un Access Key de usuario Root y colocarlo en las variables de entorno",
      "Hacer el bucket de S3 totalmente público para lectura y escritura",
      "Pasar las credenciales por parámetro en el comando de arranque del servidor"
    ],
    correctIndex: 0,
    difficultyScore: 0.75,
    version: "1.0.0",
    createdAt: { seconds: 1735689600, nanoseconds: 0 } as any,
  }
];

/**
 * Desordena pseudo-aleatoriamente las opciones de una pregunta y ajusta `correctIndex`
 * para garantizar que la posición de la respuesta correcta cambie dinámicamente entre sesiones.
 */
function shuffleOptions(question: BankQuestion): Question {
  const originalOptions = [...question.options];
  const correctAnswer = originalOptions[question.correctIndex];

  // Algoritmo Fisher-Yates para desordenar
  const shuffled = [...originalOptions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const newCorrectIndex = shuffled.indexOf(correctAnswer);

  return {
    id: question.id,
    briefing: question.briefing,
    text: question.text,
    options: shuffled,
    correctIndex: newCorrectIndex,
    difficulty: question.level,
    tag: question.tag.toLowerCase(),
  };
}

/**
 * Obtiene un conjunto de preguntas del banco (Firestore o Fallback determinista).
 * 0% consumo de IA en runtime. Respuesta instantánea <40ms.
 */
export async function sampleBankQuestions(
  requestedSkills: string[],
  _level: string = "senior",
  count: number = 5
): Promise<Question[]> {
  const normalizedSkills = requestedSkills.map((s) => s.toLowerCase().trim());
  
  const bankCandidates: BankQuestion[] = [];

  // 1) Intentar consultar el banco persistido en Firestore
  try {
    const db = adminDb();
    const snap = await db
      .collection("questions")
      .where("skill", "in", normalizedSkills.slice(0, 10))
      .get();

    if (!snap.empty) {
      snap.forEach((doc) => {
        bankCandidates.push({ id: doc.id, ...doc.data() } as BankQuestion);
      });
    }
  } catch (err) {
    console.warn("[sampleBankQuestions] Firestore fetch warning, using fallback bank:", err);
  }

  // 2) Si Firestore no tiene suficientes preguntas aún (modo inicial/fallback), filtrar el banco semilla
  if (bankCandidates.length < count) {
    const matchedFallback = INITIAL_QUESTION_BANK.filter((q) =>
      normalizedSkills.some((s) => q.skill.toLowerCase().includes(s) || s.includes(q.skill.toLowerCase()))
    );

    // Combinar y eliminar duplicados por ID
    const existingIds = new Set(bankCandidates.map((q) => q.id));
    for (const item of matchedFallback) {
      if (!existingIds.has(item.id)) {
        bankCandidates.push(item);
      }
    }

    // Si aún faltan, incluir preguntas generales de la reserva
    if (bankCandidates.length < count) {
      for (const item of INITIAL_QUESTION_BANK) {
        if (!existingIds.has(item.id)) {
          bankCandidates.push(item);
          if (bankCandidates.length >= count * 2) break;
        }
      }
    }
  }

  // 3) Barajar candidatos y seleccionar `count` preguntas
  const shuffledCandidates = [...bankCandidates].sort(() => Math.random() - 0.5);
  const selected = shuffledCandidates.slice(0, count);

  // 4) Desordenar las opciones para cada sesión individual
  return selected.map(shuffleOptions);
}
