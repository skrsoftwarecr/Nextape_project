import { db } from "@/lib/firebase/client";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { UserSkillScores } from "@/types/user.types";

export const ScoringService = {
  /**
   * Updates or creates a user's skill score in the user_skill_scores collection.
   * Only features/assessments/ should write to user_skill_scores.
   */
  updateUserSkillScore: async (
    userId: string,
    skill: string,
    difficulty: "junior" | "mid" | "senior",
    newScore: number
  ): Promise<void> => {
    // 3. Validación de rango de score (0-100)
    if (newScore < 0 || newScore > 100) {
      throw new Error("Score fuera de rango");
    }

    try {
      const docRef = doc(db, "user_skill_scores", userId);

      // 4. Envuelve la lógica en runTransaction para evitar race conditions
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);

        // 5. Valida que docSnap exista y tenga la propiedad scores definida
        const data = docSnap.data();
        if (docSnap.exists() && data && data.scores !== undefined) {
          const typedData = data as UserSkillScores;
          const currentScores = typedData.scores || {};
          const currentSkillScores = currentScores[skill] || {};

          const updatedScores = {
            ...currentScores,
            [skill]: {
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
          // 2. Creación de nuevo documento: omitir llaves no actualizadas
          transaction.set(docRef, {
            uid: userId,
            scores: {
              [skill]: {
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
