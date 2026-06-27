import { db } from "@/lib/firebase/client";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AssessmentSession, AssessmentAttempt, Question } from "../types/assessment.types";
import { AttemptsService } from "./attempts.service";
import { ScoringService } from "./scoring.service";

export const AssessmentService = {
  /**
   * Finaliza una evaluación, calcula el score, guarda el assessment y el intento, 
   * y desencadena el recálculo del user_skill_score.
   */
  submitAssessment: async (
    uid: string,
    session: AssessmentSession,
    questions: Question[]
  ): Promise<{ score: number }> => {
    try {
      // 1. Calculate Score
      const score = ScoringService.calculateAttemptScore(session.answers, questions);

      // 2. Save the completed assessment record
      const assessmentsCol = collection(db, "assessments");
      const assessmentRef = doc(assessmentsCol);
      
      const assessmentData = {
        uid,
        skillId: session.skillId,
        score,
        startedAt: session.startedAt,
        completedAt: serverTimestamp(),
      };
      await setDoc(assessmentRef, assessmentData);

      // 3. Save the attempt
      // Nota: Asumimos dificultad "mid" por defecto para este ejemplo,
      // la lógica real de dificultad podría depender de las preguntas o del user.
      const attemptData: Omit<AssessmentAttempt, "id" | "completedAt" | "usedForScore"> = {
        uid,
        skillId: session.skillId,
        answers: session.answers,
        score,
        approved: true, // Asumimos que si se calculó bien, está aprobado
        difficulty: "mid"
      };
      await AttemptsService.saveAttempt(attemptData);

      // 4. Recalculate average score for this skill
      await AttemptsService.recalculateActiveAttempts(uid, session.skillId, "mid");

      return { score };
    } catch (error) {
      console.error("Error submitting assessment:", error);
      throw error;
    }
  }
};

export default AssessmentService;
