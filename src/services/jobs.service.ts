import { queryCollection, getDocById } from "@/lib/firebase/firestore";
import { JobOpportunity } from "@/types/job.types";
import { orderBy, limit, where } from "firebase/firestore";
import { calculateMatch } from "@/lib/match";

export const JobService = {
  /**
   * Obtiene las vacantes más recientes.
   */
  getLatestJobs: () => queryCollection<JobOpportunity>("jobs", orderBy("postedAt", "desc"), limit(20)),

  /**
   * Obtiene una vacante por ID.
   */
  getJob: (jobId: string) => getDocById<JobOpportunity>("jobs", jobId),

  /**
   * Vacantes creadas por un reclutador (para sus paneles de gestión y candidatos).
   */
  getJobsByRecruiter: (uid: string) =>
    queryCollection<JobOpportunity>("jobs", where("createdBy", "==", uid), orderBy("postedAt", "desc")),

  /**
   * Calcula el match score basado en el DNA técnico del usuario (ver `src/lib/match.ts`).
   * Nota: la generación de la prueba técnica de una vacante ocurre en servidor
   * (POST /api/jobs/assessment), no aquí, para no exponer la clave de respuestas.
   */
  calculateMatch,
};
