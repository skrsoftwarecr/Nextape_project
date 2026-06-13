
"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Brain } from "lucide-react";

const JOBS_COMPATIBILITY = [
  { company: "Vercel", role: "Senior Frontend Engineer", score: 98, missing: ["Testing E2E Advanced"], matchReason: "Maestría en Next.js y React verificada en The LINE." },
  { company: "Prisma", role: "Backend Architect", score: 92, missing: ["Postgres Optimization"], matchReason: "Sólida arquitectura de sistemas y manejo de tipos." }
];

export default function CompatibilityPage() {
  return (
    <DashboardShell>
      <div className="space-y-12">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-black">Compatibility Engine.</h1>
          <p className="text-gray-500 font-medium">Analizamos la brecha entre tu perfil y los puestos de mayor impacto.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="col-span-1 md:col-span-2 bg-gray-950 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-apple-lg relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                 <h2 className="text-3xl font-bold tracking-tight">Tu potencial de <br /><span className="text-brand-blue">contratación es alto.</span></h2>
              </div>
              <div className="text-center relative z-10 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                 <span className="text-6xl font-black italic tracking-tighter text-brand-blue">9.2</span>
                 <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">Rank Score</span>
              </div>
           </div>
           
           <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 flex flex-col justify-center space-y-6">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                 <Brain className="h-6 w-6 text-brand-blue" />
              </div>
              <div className="space-y-2">
                 <h4 className="font-bold text-xl text-black">Skill Gap</h4>
                 <p className="text-sm text-gray-400 font-medium">Faltan 2 habilidades clave para puestos Tier 1.</p>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-2xl font-bold tracking-tight px-2 text-black">Matches de Alta Fidelidad</h3>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {JOBS_COMPATIBILITY.map((job, idx) => (
                <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-apple space-y-8 group hover:shadow-apple-lg transition-all">
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                         <h4 className="text-2xl font-bold group-hover:text-brand-blue transition-colors text-black">{job.role}</h4>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{job.company}</p>
                      </div>
                      <div className="text-4xl font-black text-brand-blue tracking-tighter">{job.score}%</div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-brand-blue">¿Por qué encajas?</span>
                         <p className="text-xs font-medium text-gray-600 italic leading-relaxed">"{job.matchReason}"</p>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                         <Briefcase className="h-4 w-4" /> Ver Vacante
                      </div>
                      <ArrowRight className="h-5 w-5 text-brand-blue group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
