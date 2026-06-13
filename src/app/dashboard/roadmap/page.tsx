
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, ChevronRight, CheckCircle2, Clock, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_STEPS = [
  { id: 1, title: "Distributed Systems Fundamentals", status: "completed", desc: "Arquitecturas event-driven y CAP theorem.", time: "12h" },
  { id: 2, title: "Next.js Advanced Performance", status: "active", desc: "PPR, ISR dinámico y optimización de hydratación.", time: "8h" },
  { id: 3, title: "Rust for WASM Modules", status: "pending", desc: "Integración de módulos Rust en el frontend.", time: "20h" },
  { id: 4, title: "Reliability & SRE Mastery", status: "pending", desc: "Observabilidad y recuperación ante fallos.", time: "15h" }
];

export default function RoadmapPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tu Roadmap.</h1>
          <p className="text-gray-500 font-medium">Ruta personalizada generada por IA para alcanzar el nivel Senior Mastery.</p>
        </div>
        <Button className="bg-brand-blue text-white rounded-2xl h-14 px-8 font-bold uppercase tracking-widest text-[10px] shadow-apple hover:scale-105 transition-all">
          <Zap className="mr-2 h-4 w-4" /> Regenerar Ruta
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50 space-y-6">
              <div className="space-y-1">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Progreso de Carrera</span>
                 <p className="text-4xl font-black tracking-tighter text-brand-blue">64%</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Target className="h-4 w-4 text-brand-blue" /> Meta: Tech Lead
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Clock className="h-4 w-4 text-brand-blue" /> Est. 3 Meses
                 </div>
              </div>
           </div>
           
           <div className="bg-brand-blue p-8 rounded-[2rem] text-white shadow-apple-lg relative overflow-hidden">
              <h4 className="font-bold text-lg mb-2 relative z-10">Próximo Hito</h4>
              <p className="text-sm opacity-80 relative z-10">Completa "Next.js Advanced" para subir al Top 3% global.</p>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
           </div>
        </div>

        {/* Steps Timeline */}
        <div className="lg:col-span-3 space-y-6">
           {MOCK_STEPS.map((step, idx) => (
             <div key={step.id} className={`bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-apple flex flex-col md:flex-row gap-8 items-center group transition-all ${step.status === 'active' ? 'ring-2 ring-brand-blue/20' : ''}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-apple transition-colors ${step.status === 'completed' ? 'bg-brand-green/10 text-brand-green' : step.status === 'active' ? 'bg-brand-blue text-white' : 'bg-gray-50 text-gray-300'}`}>
                   {step.status === 'completed' ? <CheckCircle2 className="h-8 w-8" /> : <span className="text-2xl font-black italic">{idx + 1}</span>}
                </div>
                
                <div className="flex-grow space-y-2">
                   <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      {step.status === 'active' && <Badge className="bg-brand-blue/10 text-brand-blue border-none rounded-full px-3 text-[8px] font-bold uppercase tracking-widest">En Curso</Badge>}
                   </div>
                   <p className="text-sm text-gray-500 font-medium">{step.desc}</p>
                   <div className="pt-2 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <Clock className="h-3 w-3" /> {step.time}
                      <Zap className="h-3 w-3" /> 450 XP
                   </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                   <Button variant={step.status === 'active' ? 'default' : 'outline'} className={`w-full rounded-2xl h-14 px-8 font-bold uppercase tracking-widest text-[10px] ${step.status === 'active' ? 'bg-black text-white' : ''}`}>
                      {step.status === 'completed' ? 'Revisar' : step.status === 'active' ? 'Continuar' : 'Iniciar'}
                   </Button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
