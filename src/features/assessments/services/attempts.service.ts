import { db } from "@/lib/firebase/client";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch,
  serverTimestamp,
  FieldValue,
  QueryConstraint
} from "firebase/firestore";
import { AssessmentAttempt } from "@/types/assessment.types";
import ScoringService from "./scoring.service";

export const AttemptsService = {
  /**
   * Saves an attempt when an assessment is completed.
   * Default usedForScore to false until recalculation.
   */
  saveAttempt: async (
    attempt: Omit<AssessmentAttempt, "id" | "completedAt" | "usedForScore">
  ): Promise<string> => {
    try {
      const attemptsCol = collection(db, "assessment_attempts");
      const docRef = doc(attemptsCol);
      const newAttempt = {
        ...attempt,
        id: docRef.id,
        completedAt: serverTimestamp(),
        usedForScore: false
      };
      await setDoc(docRef, newAttempt);
      return docRef.id;
    } catch (error) {
      console.error("Error in saveAttempt:", error);
      throw error;
    }
  },

  /**
   * Retrieves the attempt history for a specific user, skill, and difficulty.
   * Ordered by completedAt DESC.
   */
  getAttemptsBySkill: async (
    userId: string,
    skill: string,
    difficulty: "junior" | "mid" | "senior",
    limitCount?: number
  ): Promise<AssessmentAttempt[]> => {
    try {
      const attemptsCol = collection(db, "assessment_attempts");
      const constraints: QueryConstraint[] = [
        where("userId", "==", userId),
        where("skill", "==", skill),
        where("difficulty", "==", difficulty),
        orderBy("completedAt", "desc")
      ];
      
      if (limitCount !== undefined) {
        constraints.push(limit(limitCount));
      }

      const q = query(attemptsCol, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as AssessmentAttempt);
    } catch (error) {
      console.error("Error in getAttemptsBySkill:", error);
      throw error;
    }
  },

  /**
   * Marks the last 3 attempts for a user+skill+difficulty as active (usedForScore: true),
   * marks all other attempts as inactive (usedForScore: false),
   * and recalculates/saves the new average score in user_skill_scores using ScoringService.
   */
  recalculateActiveAttempts: async (
    userId: string,
    skill: string,
    difficulty: "junior" | "mid" | "senior"
  ): Promise<void> => {
    try {
      // Fetch all attempts for this user, skill, and difficulty, sorted newest first.
      const attempts = await AttemptsService.getAttemptsBySkill(userId, skill, difficulty);

      const activeAttempts = attempts.slice(0, 3);
      const inactiveAttempts = attempts.slice(3);

      const batch = writeBatch(db);
      let needsCommit = false;
      let totalScoreSum = 0;

      // Update active attempts to usedForScore: true if they aren't already.
      for (const attempt of activeAttempts) {
        totalScoreSum += attempt.score;
        if (!attempt.usedForScore) {
          const docRef = doc(db, "assessment_attempts", attempt.id);
          batch.update(docRef, { usedForScore: true });
          needsCommit = true;
        }
      }

      // Update remaining attempts to usedForScore: false if they aren't already.
      for (const attempt of inactiveAttempts) {
        if (attempt.usedForScore) {
          const docRef = doc(db, "assessment_attempts", attempt.id);
          batch.update(docRef, { usedForScore: false });
          needsCommit = true;
        }
      }

      if (needsCommit) {
        await batch.commit();
      }

      // Calculate the new average score of the active attempts.
      const newAverageScore = activeAttempts.length > 0 ? Math.round(totalScoreSum / activeAttempts.length) : 0;

      // Delegate writing the average score to ScoringService (respects modular Monolith rule).
      await ScoringService.updateUserSkillScore(userId, skill, difficulty, newAverageScore);
    } catch (error) {
      console.error("Error in recalculateActiveAttempts:", error);
      throw error;
    }
  }
};

export default AttemptsService;
