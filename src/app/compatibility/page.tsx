
"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const JOBS_COMPATIBILITY = [
  { company: "Vercel", role: "Senior Frontend Engineer", score: 98, missing: ["Testing E2E Advanced"], matchReason: "Maestría en Next.js y React verificada en The LINE." },
  { company: "Prisma", role: "Backend Architect", score: 92, missing: ["Postgres Optimization"], matchReason: "Sólida arquitectura de sistemas y manejo de tipos." },
  { company: "Linear", role: "Product Engineer", score: 87, missing: ["Clojure Basics"], matchReason: "Atención al detalle y performance de UI excepcional." }
];

export default function CompatibilityPage() {
  return (
    <DashboardShell>
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-black italic">Compatibility Engine.</h1>
            <p className="text-gray-500 font-medium">Análisis de brecha técnica entre tu perfil y las vacantes de élite.</p>
          </div>
          <Button className="h-14 px-8 bg-brand-blue rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-apple hover:scale-105 transition-all">
            <Zap className="mr-2 h-4 w-4" /> Ejecutar Auditoría
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="col-span-1 md:col-span-2 bg-gray-950 p-12 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-apple-lg relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">AI_ANALYSIS_ACTIVE</span>
                 </div>
                 <h2 className="text-3xl font-bold tracking-tight leading-tight">Tu potencial de <br /><span className="text-brand-blue">contratación es excepcional.</span></h2>
                 <p className="text-gray-400 text-sm max-w-sm">Estás en el top 3% para vacantes de Arquitectura UI.</p>
              </div>
              <div className="text-center relative z-10 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl">
                 <span className="text-7xl font-black italic tracking-tighter text-brand-blue leading-none">9.2</span>
                 <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-4">Rank Score</span>
              </div>
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl" />
           </div>
           
           <div className="bg-white p-12 rounded-[2.5rem] shadow-apple border border-gray-50 flex flex-col justify-center space-y-8">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                 <Target className="h-7 w-7 text-brand-blue" />
              </div>
              <div className="space-y-2">
                 <h4 className="font-bold text-2xl text-black">Skill Gap.</h4>
                 <p className="text-sm text-gray-400 font-medium leading-relaxed">Identificamos 2 habilidades clave para desbloquear puestos Tier 1.</p>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-2xl font-bold tracking-tight px-2 text-black italic">Matches de Alta Fidelidad.</h3>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {JOBS_COMPATIBILITY.map((job, idx) => (
                <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-apple space-y-10 group hover:shadow-apple-lg transition-all">
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                         <h4 className="text-3xl font-bold group-hover:text-brand-blue transition-colors text-black leading-none">{job.role}</h4>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{job.company}</p>
                      </div>
                      <div className="text-5xl font-black text-brand-blue tracking-tighter">{job.score}%</div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="p-6 bg-gray-50 rounded-[1.5rem] space-y-3">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-brand-blue">Análisis de IA</span>
                         <p className="text-sm font-medium text-gray-600 italic leading-relaxed">"{job.matchReason}"</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.missing.map(m => (
                          <Badge key={m} variant="outline" className="border-red-100 text-brand-red rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest">{m}</Badge>
                        ))}
                      </div>
                   </div>

                   <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                         <Briefcase className="h-4 w-4" /> Aplicar Ahora
                      </div>
                      <ArrowRight className="h-6 w-6 text-brand-blue group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
