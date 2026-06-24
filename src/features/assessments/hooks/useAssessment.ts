import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { subscribeToAuth } from "@/lib/firebase/auth";
import { AssessmentSession, Question, QuestionOption } from "../types/assessment.types";
import { AssessmentRepository } from "../repositories/assessment.repository";
import { AssessmentService } from "../services/assessments.service";

type AssessmentState = "idle" | "loading" | "active" | "submitting" | "completed";

export const useAssessment = () => {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<AssessmentState>("idle");
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [result, setResult] = useState<{ score: number; newSkillScore?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const startAssessment = async (skillId: string) => {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }
    setState("loading");
    setError(null);
    try {
      const questions = await AssessmentRepository.getApprovedQuestionsBySkill(skillId);
      if (questions.length === 0) {
        throw new Error("No hay preguntas aprobadas para esta habilidad");
      }
      
      const newSession: AssessmentSession = {
        questions,
        currentIndex: 0,
        answers: {},
        skillId,
        startedAt: new Date()
      };
      
      setSession(newSession);
      setState("active");
    } catch (err: any) {
      setError(err.message || "Error al iniciar la evaluación");
      setState("idle");
    }
  };

  const answerQuestion = (questionId: string, option: QuestionOption) => {
    if (!session || state !== "active") return;

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: option
        },
        currentIndex: prev.currentIndex + 1
      };
    });
  };

  const submitAssessment = async () => {
    if (!user || !session || state !== "active") return;
    
    // Check if we answered all questions, or if we are forced to submit early.
    // In a real scenario we'd require all to be answered.
    setState("submitting");
    try {
      const { score } = await AssessmentService.submitAssessment(user.uid, session, session.questions);
      setResult({ score });
      setState("completed");
    } catch (err: any) {
      setError(err.message || "Error al enviar la evaluación");
      setState("active"); // revert to active so they can try again?
    }
  };

  const currentQuestion: Question | null = session && session.currentIndex < session.questions.length 
    ? session.questions[session.currentIndex] 
    : null;
    
  const progress = session && session.questions.length > 0 
    ? (Object.keys(session.answers).length / session.questions.length) * 100 
    : 0;

  return {
    state,
    session,
    currentQuestion,
    progress,
    result,
    error,
    startAssessment,
    answerQuestion,
    submitAssessment
  };
};