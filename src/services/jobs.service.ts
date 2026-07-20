import { queryCollection, getDocById } from "@/lib/firebase/firestore";
import { JobOpportunity, Question } from "@/types/job.types";
import { orderBy, limit, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { generateQuestions } from "@/ai/flows/generate-assessment-flow";

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
   * Calcula el match score real basado en el DNA técnico del usuario.
   */
  calculateMatch: (jobSkills: string[], userScores: { [key: string]: number }) => {
    if (!jobSkills || !jobSkills.length) return 0;
    if (!userScores || Object.keys(userScores).length === 0) return 0;
    
    let totalScore = 0;
    let foundSkills = 0;

    const normalizedJobSkills = jobSkills.map(s => s.toLowerCase());

    normalizedJobSkills.forEach(skill => {
      if (userScores[skill] !== undefined) {
        totalScore += userScores[skill];
        foundSkills++;
      }
    });

    if (foundSkills === 0) return 0;
    return Math.round(totalScore / jobSkills.length);
  },

  /**
   * Genera y guarda preguntas de evaluación para una vacante específica usando IA.
   */
  generateJobAssessment: async (jobId: string, stack: string[], level: string): Promise<Question[]> => {
    try {
      // Llamada al flujo de Genkit para generar preguntas basadas en el stack real
      const result = await generateQuestions({ 
        stack, 
        level, 
        count: 5 
      });

      const questions = result.questions;
      
      const jobRef = doc(db, "jobs", jobId);
      
      // Actualizamos el documento con las preguntas generadas por IA
      await updateDoc(jobRef, {
        assessmentQuestions: questions,
        updatedAt: Timestamp.now()
      });

      return questions as Question[];
    } catch (error) {
      console.error("AI Generation failed for job assessment:", error);
      return [];
    }
  }
};
