
"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Terminal, Award, FileText, Code2 } from "lucide-react";

const SKILLS = [
  { name: "Core JavaScript / TypeScript", value: 92 },
  { name: "React / Ecosystem", value: 88 },
  { name: "Backend Architecture", value: 75 },
  { name: "DevOps & CI/CD", value: 64 },
  { name: "Testing & QA", value: 81 },
  { name: "UI/UX Implementation", value: 94 }
];

const ASSESSMENT_HISTORY = [
  { name: "The LINE: Frontend Master", score: 98, date: "Oct 24, 2024", badge: "Expert" },
  { name: "React Performance Audit", score: 91, date: "Oct 12, 2024", badge: "Advanced" },
  { name: "System Scalability", score: 84, date: "Sep 28, 2024", badge: "Proficient" }
];

export default function ProfilePage() {
  return (
    <div className="space-y-8 md:space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tu Identidad.</h1>
          <p className="text-gray-500 font-medium text-sm">Perfil verificado por el ecosistema Nextape.</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-apple border border-gray-50 flex items-center justify-between md:flex-col md:items-center min-w-full md:min-w-[200px]">
          <div className="md:text-center">
            <span className="text-5xl md:text-6xl font-black tracking-tighter text-brand-blue leading-none">A+</span>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] block mt-1 md:mt-3 text-gray-300">Grado Global</span>
          </div>
          <div className="md:hidden">
            <Badge className="bg-brand-blue/10 text-brand-blue rounded-full border-none">TOP 5%</Badge>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Left Column: Info & Stats */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold tracking-tight px-2">Technical DNA</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-apple border border-gray-50">
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Stack Principal</span>
                <p className="text-sm md:text-lg font-bold text-gray-800">TypeScript / Rust</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Especialidad</span>
                <p className="text-sm md:text-lg font-bold text-gray-800">UI Architecture</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Experiencia</span>
                <p className="text-sm md:text-lg font-bold text-gray-800">Senior (7+ Years)</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Ubicación</span>
                <p className="text-sm md:text-lg font-bold text-gray-800">Remote</p>
              </div>
            </div>
          </div>

          {/* Skill Metrics */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold tracking-tight px-2">Métricas Verificadas</h2>
            <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-apple border border-gray-50">
              {SKILLS.map((skill) => (
                <div key={skill.name} className="space-y-2 md:space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-[10px] uppercase tracking-widest text-gray-500">{skill.name}</span>
                    <span className="font-bold text-base md:text-xl text-brand-blue">{skill.value}%</span>
                  </div>
                  <div className="h-2 md:h-3 rounded-full bg-gray-50 overflow-hidden border border-gray-100/50">
                    <div 
                      className="h-full bg-brand-blue rounded-full transition-all duration-1000" 
                      style={{ width: `${skill.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: History & Badges */}
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold tracking-tight px-2">The LINE Records</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {ASSESSMENT_HISTORY.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-gray-50 shadow-apple hover:shadow-apple-lg transition-all group cursor-default">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-brand-blue/10 transition-colors">
                      <Terminal className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                    </div>
                    <span className="text-2xl md:text-3xl font-black tracking-tighter text-brand-blue">{item.score}</span>
                  </div>
                  <p className="font-bold text-gray-800 text-sm md:text-base mb-1">{item.name}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{item.date}</p>
                  <Badge className="bg-gray-50 text-gray-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue rounded-full font-bold uppercase text-[8px] md:text-[9px] tracking-[0.2em] px-3 py-1 transition-colors border-none">
                    {item.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] text-white space-y-4 md:space-y-6 shadow-apple-lg relative overflow-hidden group">
             <div className="bg-brand-blue/10 p-2 md:p-3 rounded-xl md:rounded-2xl w-fit">
               <Award className="h-6 w-6 md:h-8 md:w-8 text-brand-blue" />
             </div>
             <div className="space-y-2 relative z-10">
               <h3 className="text-lg md:text-xl font-bold">Próximos Pasos</h3>
               <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                 Estás en el top 5% global. Completa "Advanced Distributed Systems" para desbloquear vacantes Tier 1.
               </p>
             </div>
             <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
