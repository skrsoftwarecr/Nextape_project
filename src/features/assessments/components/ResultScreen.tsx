import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ResultScreenProps {
  score: number;
  onContinue: () => void;
}

export default function ResultScreen({ score, onContinue }: ResultScreenProps) {
  return (
    <div className="max-w-md mx-auto text-center space-y-8 py-12">
      <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-brand-blue" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-black font-headline italic tracking-tighter">
          Evaluación Completada
        </h2>
        <p className="text-gray-500 font-medium">
          Tu desempeño en este escenario ha sido analizado.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Score Obtenido</p>
        <p className="text-6xl font-black text-brand-blue">{score}</p>
      </div>

      <Button 
        onClick={onContinue}
        className="w-full bg-black text-white h-16 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-transform hover:scale-105"
      >
        Continuar al Dashboard
      </Button>
    </div>
  );
}
