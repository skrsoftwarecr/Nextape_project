import React, { useState } from "react";
import { Question, QuestionOption } from "../types/assessment.types";
import { Button } from "@/components/ui/button";

interface QuestionScreenProps {
  question: Question;
  progress: number;
  onAnswer: (questionId: string, option: QuestionOption) => void;
}

export default function QuestionScreen({ question, progress, onAnswer }: QuestionScreenProps) {
  const [selected, setSelected] = useState<QuestionOption | null>(null);


  const handleSubmit = () => {
    if (selected) {
      onAnswer(question.id, selected);
      setSelected(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-6 space-y-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-brand-blue h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Scenario */}
      <div className="space-y-4 bg-gray-950 text-white p-8 rounded-[2rem] shadow-apple-lg">
        <h2 className="text-[10px] uppercase font-bold tracking-widest text-brand-blue">Escenario</h2>
        <p className="text-lg md:text-xl font-medium leading-relaxed">
          {question.scenario}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {(["bad", "acceptable", "excellent"] as QuestionOption[]).map((option) => (
          <div
            key={option}
            onClick={() => setSelected(option)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selected === option
              ? "border-brand-blue bg-brand-blue/5"
              : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
          >
            <p className={`text-sm font-medium ${selected === option ? "text-brand-blue" : "text-gray-600"}`}>
              {question.options[option]}
            </p>
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="bg-black text-white h-14 px-10 rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-50"
        >
          Siguiente Escenario
        </Button>
      </div>
    </div>
  );
}
