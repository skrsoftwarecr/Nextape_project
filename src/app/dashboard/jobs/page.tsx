"use client";

import React from "react";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import JobCard from "@/features/jobs/components/JobCard";
import JobDetail from "@/features/jobs/components/JobDetail";

export default function JobsPage() {
  const { jobs, loading, error, selectedJob, selectJob } = useJobs();

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] min-h-[calc(100vh-4rem)] md:min-h-screen py-10 px-6">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">Vacantes Disponibles</h1>
          <p className="text-gray-500 font-medium">Encuentra tu próximo desafío técnico basado en tus habilidades demostradas.</p>
        </div>

        {error && (
          <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red font-bold text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Lista de Jobs */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : jobs.length === 0 && !error ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 font-medium">No hay vacantes activas en este momento.</p>
              </div>
            ) : (
              jobs.map(job => (
                <JobCard 
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onSelect={selectJob}
                />
              ))
            )}
          </div>

          {/* Columna Derecha: Detalles del Job */}
          <div className="lg:col-span-7 xl:col-span-8 sticky top-24 hidden lg:block">
            <JobDetail job={selectedJob} />
          </div>

          {/* Versión Mobile del Detalle (cuando hay uno seleccionado) */}
          {selectedJob && (
            <div className="lg:hidden fixed inset-0 z-50 bg-[#F5F5F7] overflow-y-auto p-6 pt-20">
              <button 
                onClick={() => selectJob("")} 
                className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-sm text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <JobDetail job={selectedJob} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
