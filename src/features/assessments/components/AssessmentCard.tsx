import React from "react";
import { Button } from "@/components/ui/button";

interface AssessmentCardProps {
  skillId: string;
  skillName: string;
  description: string;
  onStart: (skillId: string) => void;
  isLoading?: boolean;
}

export default function AssessmentCard({
  skillId,
  skillName,
  description,
  onStart,
  isLoading = false
}: AssessmentCardProps) {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-apple flex flex-col justify-between items-start gap-6">
      <div className="space-y-2 w-full">
        <h3 className="text-xl font-bold text-slate-900">{skillName}</h3>
        <p className="text-sm text-gray-500 font-medium">{description}</p>
      </div>
      
      <Button
        onClick={() => onStart(skillId)}
        disabled={isLoading}
        className="w-full bg-brand-blue text-white rounded-xl font-bold uppercase tracking-widest text-xs h-12 shadow-sm hover:bg-brand-blue/90 transition-colors"
      >
        {isLoading ? "Iniciando..." : "Ingresar a THE LINE"}
      </Button>
    </div>
  );
}
