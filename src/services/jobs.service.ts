import { queryCollection, getDocById, updateDocById } from "@/lib/firebase/firestore";
import { JobOpportunity } from "@/types/job.types";
import { orderBy, limit, where, Timestamp } from "firebase/firestore";
import { calculateMatch } from "@/lib/match";

/** Milisegundos de un `postedAt` que podría no ser un Timestamp (docs antiguos o incompletos). */
function postedAtMillis(job: JobOpportunity): number {
  return job.postedAt instanceof Timestamp ? job.postedAt.toMillis() : 0;
}

export const JobService = {
  /**
   * Vacantes más recientes abiertas a candidaturas.
   *
   * Las archivadas se filtran en cliente (no en la query) porque `active` no existe en las
   * vacantes creadas antes de ese campo, y un `where("active","==",true)` las dejaría fuera.
   */
  getLatestJobs: async () => {
    const jobs = await queryCollection<JobOpportunity>(
      "jobs",
      orderBy("postedAt", "desc"),
      limit(20)
    );
    return jobs.filter((job) => job.active !== false);
  },

  /**
   * Obtiene una vacante por ID.
   */
  getJob: (jobId: string) => getDocById<JobOpportunity>("jobs", jobId),

  /**
   * Vacantes creadas por un reclutador (para sus paneles de gestión y candidatos).
   *
   * Se ordena en cliente a propósito: `where(createdBy) + orderBy(postedAt)` exige un **índice
   * compuesto** en Firestore y, sin él, la query lanza `failed-precondition`. El reclutador veía
   * entonces "no tienes vacantes" aunque las tuviera. Un reclutador maneja pocas vacantes, así
   * que ordenar aquí sale gratis y elimina la dependencia de infra. Mismo criterio que
   * `CompatibilityService.getMatchesForRecruiter`.
   */
  getJobsByRecruiter: async (uid: string) => {
    const jobs = await queryCollection<JobOpportunity>("jobs", where("createdBy", "==", uid));
    return jobs.sort((a, b) => postedAtMillis(b) - postedAtMillis(a));
  },

  /**
   * Actualiza una vacante. Las reglas solo dejan escribir al reclutador dueño (`createdBy`) y no
   * permiten reasignar la propiedad; el repertorio de preguntas NO se toca desde aquí (vive en
   * `job_answer_keys`, server-only, y se regenera con `POST /api/jobs/assessment`).
   */
  updateJob: (jobId: string, data: Partial<JobOpportunity>) =>
    updateDocById<JobOpportunity>("jobs", jobId, data),

  /**
   * Calcula el match score basado en el DNA técnico del usuario (ver `src/lib/match.ts`).
   * Nota: la generación de la prueba técnica de una vacante ocurre en servidor
   * (POST /api/jobs/assessment), no aquí, para no exponer la clave de respuestas.
   */
  calculateMatch,
};
