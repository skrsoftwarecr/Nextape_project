
"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Terminal, Award, FileText, Code2 } from "lucide-react";

const SKILLS = [
  { name: "Core JavaScript / TypeScript", value: 92 },
  { name: "React / Frontend Ecosystem", value: 88 },
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
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tu Identidad.</h1>
          <p className="text-gray-500 font-medium">Perfil verificado por el ecosistema Nextape.</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50 flex flex-col items-center min-w-[200px]">
          <span className="text-6xl font-black tracking-tighter text-brand-blue leading-none">A+</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mt-3 text-gray-300">Grado Global</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info & Stats */}
        <div className="lg:col-span-2 space-y-12">
          {/* Personal Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight px-2">Technical DNA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Stack Principal</span>
                <p className="text-lg font-bold text-gray-800">TypeScript / Rust</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Especialidad</span>
                <p className="text-lg font-bold text-gray-800">UI Architecture</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Experiencia</span>
                <p className="text-lg font-bold text-gray-800">Senior (7+ Years)</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Ubicación</span>
                <p className="text-lg font-bold text-gray-800">Remote / Worldwide</p>
              </div>
            </div>
          </div>

          {/* Skill Metrics */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight px-2">Métricas Verificadas</h2>
            <div className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50">
              {SKILLS.map((skill) => (
                <div key={skill.name} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-xs uppercase tracking-widest text-gray-500">{skill.name}</span>
                    <span className="font-bold text-xl text-brand-blue">{skill.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-50 overflow-hidden border border-gray-100/50">
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
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight px-2">The LINE Records</h2>
            <div className="space-y-4">
              {ASSESSMENT_HISTORY.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-apple hover:shadow-apple-lg transition-all group cursor-default">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-brand-blue/10 transition-colors">
                      <Terminal className="h-5 w-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-brand-blue">{item.score}</span>
                  </div>
                  <p className="font-bold text-gray-800 mb-1">{item.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{item.date}</p>
                  <Badge className="bg-gray-50 text-gray-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue rounded-full font-bold uppercase text-[9px] tracking-[0.2em] px-4 py-1.5 transition-colors border-none">
                    {item.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 p-10 rounded-[2.5rem] text-white space-y-6 shadow-apple-lg relative overflow-hidden group">
             <div className="bg-brand-blue/10 p-3 rounded-2xl w-fit">
               <Award className="h-8 w-8 text-brand-blue" />
             </div>
             <div className="space-y-2 relative z-10">
               <h3 className="text-xl font-bold">Próximos Pasos</h3>
               <p className="text-sm text-gray-400 font-medium leading-relaxed">
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
