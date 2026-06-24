import { db } from "@/lib/firebase/client";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { UserSkillScores } from "@/features/auth/types/user.types";
import { Question, QuestionOption, OPTION_SCORES } from "../types/assessment.types";

export const ScoringService = {
  /**
   * Calcula el score de un intento en base a las respuestas elegidas.
   */
  calculateAttemptScore: (
    answers: Record<string, QuestionOption>,
    questions: Question[]
  ): number => {
    if (questions.length === 0) return 0;
    
    const total = questions.length * 100;
    const earned = questions.reduce((sum, q) => {
      const option = answers[q.id] ?? 'bad';
      return sum + OPTION_SCORES[option];
    }, 0);
    return Math.round((earned / total) * 100);
  },

  /**
   * Updates or creates a user's skill score in the user_skill_scores collection.
   * Only features/assessments/ should write to user_skill_scores.
   */
  updateUserSkillScore: async (
    uid: string,
    skillId: string,
    difficulty: "junior" | "mid" | "senior",
    newScore: number
  ): Promise<void> => {
    // Validación de rango de score (0-100)
    if (newScore < 0 || newScore > 100) {
      throw new Error("Score fuera de rango");
    }

    try {
      const docRef = doc(db, "user_skill_scores", uid);

      // Envuelve la lógica en runTransaction para evitar race conditions
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);

        // Valida que docSnap exista y tenga la propiedad scores definida
        const data = docSnap.data();
        if (docSnap.exists() && data && data.scores !== undefined) {
          const typedData = data as UserSkillScores;
          const currentScores = typedData.scores || {};
          const currentSkillScores = currentScores[skillId] || {};

          const updatedScores = {
            ...currentScores,
            [skillId]: {
              ...currentSkillScores,
              [difficulty]: newScore
            }
          };

          transaction.update(docRef, {
            scores: updatedScores,
            lastUpdated: serverTimestamp(),
            totalAssessments: (typedData.totalAssessments || 0) + 1
          });
        } else {
          // Creación de nuevo documento: omitir llaves no actualizadas
          transaction.set(docRef, {
            uid: uid,
            scores: {
              [skillId]: {
                [difficulty]: newScore
              }
            },
            lastUpdated: serverTimestamp(),
            totalAssessments: 1
          });
        }
      });
    } catch (error) {
      console.error("Error in updateUserSkillScore:", error);
      throw error;
    }
  }
};

export default ScoringService;
