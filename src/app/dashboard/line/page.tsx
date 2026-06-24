"use client";

import React, { useEffect } from "react";
import { useAssessment } from "@/features/assessments/hooks/useAssessment";
import AssessmentCard from "@/features/assessments/components/AssessmentCard";
import QuestionScreen from "@/features/assessments/components/QuestionScreen";
import ResultScreen from "@/features/assessments/components/ResultScreen";
import type { QuestionOption } from "@/features/assessments/types/assessment.types";
export default function TheLinePage() {
  const {
    state,
    session,
    currentQuestion,
    progress,
    result,
    error,
    startAssessment,
    answerQuestion,
    submitAssessment
  } = useAssessment();

  // If we've reached the end of the questions in an active session, auto-submit
  useEffect(() => {
    if (state === "active" && session && session.currentIndex >= session.questions.length) {
      submitAssessment();
    }
  }, [state, session, submitAssessment]);

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] min-h-[calc(100vh-4rem)] md:min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-10">

        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-black italic tracking-tighter">THE LINE</h1>
          <p className="text-gray-500 font-medium">Demuestra lo que sabes resolviendo incidentes reales.</p>
        </div>

        {error && (
          <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red font-bold text-sm">
            {error}
          </div>
        )}

        {(state === "idle" || state === "loading") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AssessmentCard
              skillId="solid"
              skillName="S.O.L.I.D. Architecture"
              description="Diseño de software mantenible, inyección de dependencias y desacoplamiento de componentes en sistemas distribuidos."
              onStart={startAssessment}
              isLoading={state === "loading"}
            />
            <AssessmentCard
              skillId="testing"
              skillName="Advanced Testing"
              description="Estrategias de pruebas unitarias, integración y end-to-end. TDD, mockeo avanzado y aserciones complejas."
              onStart={startAssessment}
              isLoading={state === "loading"}
            />
          </div>
        )}

        {state === "active" && currentQuestion && (
          <QuestionScreen
            question={currentQuestion}
            progress={progress}
            onAnswer={(_questionId: string, option: QuestionOption) => answerQuestion(currentQuestion.id, option)}
          />
        )}

        {state === "submitting" && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Evaluando desempeño...</p>
          </div>
        )}

        {state === "completed" && result && (
          <ResultScreen
            score={result.score}
            onContinue={() => window.location.reload()} // Simple reload to reset state for demo
          />
        )}

      </div>
    </div>
  );
}
