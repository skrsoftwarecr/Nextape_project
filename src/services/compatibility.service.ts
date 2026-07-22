import { queryCollection } from "@/lib/firebase/firestore";
import { where } from "firebase/firestore";
import { CandidateMatch } from "@/types/job.types";

export const CompatibilityService = {
  /**
   * Candidatos que completaron la prueba (The LINE) de las vacantes de un reclutador.
   * La regla de `candidate_matches` permite esta lectura (`recruiterId == uid`). Se ordena en
   * cliente por `score` para evitar depender de un índice compuesto en Firestore.
   */
  getMatchesForRecruiter: (recruiterId: string) =>
    queryCollection<CandidateMatch>("candidate_matches", where("recruiterId", "==", recruiterId)),
};
