
"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Zap, Award, Terminal } from "lucide-react";

const SKILLS = [
  { name: "Frontend Architecture", value: 94 },
  { name: "Systems Design", value: 82 },
  { name: "Algorithmic Efficiency", value: 88 },
  { name: "DevOps & SRE", value: 65 }
];

export default function DigitalTwinPage() {
  return (
    <DashboardShell>
      <div className="space-y-8 md:space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black italic">Digital Twin.</h1>
            <p className="text-gray-500 font-medium text-sm">Tu representación técnica verificada y clon digital.</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50 text-center min-w-[200px]">
            <span className="text-6xl font-black tracking-tighter text-brand-blue leading-none leading-none">A+</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] block mt-3 text-gray-300">Verified Master</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Skill DNA */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-blue/10 rounded-2xl">
                   <Zap className="h-6 w-6 text-brand-blue" />
                </div>
                <h2 className="text-xl font-bold text-black italic">Technical DNA (Skill Scores)</h2>
              </div>
              <div className="space-y-8">
                {SKILLS.map(skill => (
                  <div key={skill.name} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Skill Module</span>
                        <p className="font-bold text-lg text-black">{skill.name}</p>
                      </div>
                      <span className="font-black text-2xl text-brand-blue italic">{skill.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                      <div 
                        className="h-full bg-brand-blue rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Feed */}
            <div className="space-y-6">
               <h2 className="text-xl font-bold text-black italic px-2">Evidencia Verificable.</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "The LINE: Frontend Master", score: 98, date: "24 OCT" },
                    { title: "GitHub Sync: Distributed Systems", score: 85, date: "12 OCT" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-apple flex justify-between items-center group hover:border-brand-blue/20 transition-all">
                       <div className="space-y-1">
                          <p className="font-bold text-sm text-black">{item.title}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.date}</p>
                       </div>
                       <span className="text-2xl font-black text-brand-blue italic">{item.score}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Telemetry / Traits */}
          <div className="space-y-8">
             <div className="bg-gray-950 p-10 rounded-[2.5rem] text-white space-y-8 shadow-apple-lg relative overflow-hidden group">
               <div className="p-4 bg-brand-blue/20 rounded-2xl w-fit relative z-10">
                 <Fingerprint className="h-10 w-10 text-brand-blue" />
               </div>
               <div className="space-y-3 relative z-10">
                  <h3 className="text-2xl font-bold tracking-tight">Telemetría Activa.</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    Tu clon técnico ha sido consultado por 12 empresas en las últimas 24 horas. Tu perfil es visible para reclutadores Tier 1.
                  </p>
               </div>
               <div className="pt-4 flex flex-wrap gap-2 relative z-10">
                 {["Arquitecto", "Escalable", "Resolutivo"].map(t => (
                   <Badge key={t} className="bg-white/5 text-gray-400 border-none rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest">
                     {t}
                   </Badge>
                 ))}
               </div>
               <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
             </div>

             <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 space-y-6">
                <h3 className="text-lg font-bold text-black italic">Insignias Verificadas.</h3>
                <div className="space-y-4">
                   {[
                     { name: "Expert Architect", icon: Award },
                     { name: "System Integrity", icon: Terminal }
                   ].map((badge, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                           <badge.icon className="h-5 w-5 text-brand-blue" />
                        </div>
                        <span className="font-bold text-sm text-gray-700">{badge.name}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
