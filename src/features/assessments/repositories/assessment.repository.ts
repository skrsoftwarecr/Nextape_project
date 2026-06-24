import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Question } from "../types/assessment.types";

export const AssessmentRepository = {
  getApprovedQuestionsBySkill: async (skillId: string): Promise<Question[]> => {
    try {
      const q = query(
        collection(db, "questions"),
        where("skillId", "==", skillId),
        where("approved", "==", true)
      );
      
      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Question[];
      
      // Para generar variedad, podríamos mezclar las preguntas, pero aquí solo las retornamos.
      return questions;
    } catch (error) {
      console.error("Error fetching approved questions:", error);
      throw error;
    }
  }
};
