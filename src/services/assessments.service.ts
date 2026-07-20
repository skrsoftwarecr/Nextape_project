import { getDocById } from "@/lib/firebase/firestore";
import { AssessmentSession } from "@/types/assessment.types";

export const AssessmentService = {
  /**
   * Lectura de un intento de evaluación (el owner puede leer los suyos).
   *
   * La ESCRITURA de intentos ocurre solo en servidor (POST /api/line/submit, Admin SDK);
   * el cliente no crea documentos en `assessment_attempts` (regla `create: if false`).
   */
  getSession: (id: string) => getDocById<AssessmentSession>("assessment_attempts", id),
};
