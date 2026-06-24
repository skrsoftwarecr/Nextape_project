import React from "react";
import { JobSkillRequirement } from "../types/job.types";

interface JobSkillsListProps {
  skills: JobSkillRequirement[];
}

export default function JobSkillsList({ skills }: JobSkillsListProps) {
  if (skills.length === 0) {
    return <p className="text-sm text-gray-500 italic">No hay requerimientos específicos listados.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Requerimientos Técnicos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((req, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">{req.skillName}</span>
              {req.required ? (
                <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase rounded-sm">Obligatorio</span>
              ) : (
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold uppercase rounded-sm">Deseable</span>
              )}
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Nivel esperado: <span className="text-slate-700 capitalize font-bold">{req.level}</span></span>
              <span className="text-gray-500 font-medium">Min Score: <span className="text-brand-blue font-bold">{req.minScore}%</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
