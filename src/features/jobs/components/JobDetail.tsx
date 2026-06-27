import React from "react";
import { JobWithDetails } from "../types/job.types";
import JobSkillsList from "./JobSkillsList";
import CompatibilityBadge from "./CompatibilityBadge";
import { Button } from "@/components/ui/button";

interface JobDetailProps {
  job: JobWithDetails | null;
}

export default function JobDetail({ job }: JobDetailProps) {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400 bg-gray-50 rounded-[2rem] border border-gray-100 p-10 text-center">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">Selecciona una vacante de la lista para ver sus detalles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-apple-lg p-8 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex items-center gap-4">
          {job.company.logoUrl ? (
            <img 
              src={job.company.logoUrl} 
              alt={`${job.company.name} logo`} 
              className="w-16 h-16 rounded-xl object-cover border border-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">{job.company.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{job.title}</h1>
            <a 
              href={job.company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-blue font-semibold hover:underline"
            >
              {job.company.name}
            </a>
          </div>
        </div>
        <div className="flex items-center">
          <CompatibilityBadge matchScore={job.matchScore} />
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ubicación</span>
          <span className="font-semibold text-slate-700">{job.location}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Modalidad</span>
          <span className="font-semibold text-slate-700 capitalize">{job.remote}</span>
        </div>
        {(job.salaryMin && job.salaryMax) && (
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rango Salarial</span>
            <span className="font-semibold text-slate-700">
              {job.salaryMin / 1000}k - {job.salaryMax / 1000}k {job.currency}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Descripción del Rol</h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* Skills */}
      <JobSkillsList skills={job.skills} />

      {/* Actions */}
      <div className="pt-6 border-t border-gray-100">
        <Button className="w-full md:w-auto bg-black text-white h-14 px-10 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-transform hover:scale-105">
          Aplicar a Vacante
        </Button>
      </div>
    </div>
  );
}
