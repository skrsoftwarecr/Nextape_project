import { getDocById } from "@/lib/firebase/firestore";
import type { GithubEvidence } from "@/types/github.types";

export const GithubEvidenceService = {
  /**
   * Última evidencia de GitHub del usuario (`github_evidence/{uid}`).
   *
   * Solo LECTURA, y solo del dueño: la regla de Firestore es `read: isOwner(userId)` con
   * `write: false`. La escritura ocurre en `POST /api/github/evaluate` con Admin SDK, porque
   * los scores son datos "verificados" y no pueden originarse en el navegador.
   *
   * Leer esto NO dispara ninguna evaluación: solo muestra el último resultado guardado. La
   * evaluación es siempre una acción manual del usuario.
   */
  getEvidence: (uid: string) => getDocById<GithubEvidence>("github_evidence", uid),
};
