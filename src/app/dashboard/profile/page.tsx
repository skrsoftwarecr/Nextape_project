"use client";

import { Fingerprint, Zap } from "lucide-react";

const SKILLS = [
  { name: "Frontend Architecture", value: 94 },
  { name: "Systems Design", value: 82 },
  { name: "Algorithmic Efficiency", value: 88 },
  { name: "DevOps & SRE", value: 65 }
];

export default function ProfilePage() {
  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black italic">Mi Perfil.</h1>
          <p className="text-gray-500 font-medium text-sm">Tu representación técnica verificada y clon digital.</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 text-center min-w-[240px]">
          <span className="text-7xl font-black tracking-tighter text-brand-blue leading-none italic">A+</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] block mt-4 text-gray-300">Verified Master</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-12 rounded-[3rem] shadow-apple border border-gray-50 space-y-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-brand-blue/10 rounded-2xl">
                 <Zap className="h-7 w-7 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-bold text-black italic">Technical DNA</h2>
            </div>
            <div className="space-y-10">
              {SKILLS.map(skill => (
                <div key={skill.name} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="font-bold text-lg text-black">{skill.name}</p>
                    <span className="font-black text-2xl text-brand-blue italic">{skill.value}%</span>
                  </div>
                  <div className="h-4 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-brand-blue rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-950 p-12 rounded-[3rem] text-white space-y-10 shadow-apple-lg relative overflow-hidden group">
             <Fingerprint className="h-12 w-12 text-brand-blue relative z-10" />
             <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-bold tracking-tight italic">Telemetría Activa.</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Tu clon técnico ha sido consultado por 12 empresas en las últimas 24 horas. Perfil optimizado para puestos Tier 1.
                </p>
             </div>
             <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
           </div>
        </div>
      </div>
    </div>
  );
}
