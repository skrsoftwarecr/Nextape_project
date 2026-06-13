"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Sistemas Distribuidos", desc: "Patrones de consistencia y consenso (Raft/Paxos).", hours: 40, status: "in_progress" },
  { title: "Optimización de Runtime", desc: "Deep dive en V8 y gestión de memoria.", hours: 25, status: "pending" },
  { title: "Arquitectura Hexagonal", desc: "Implementación de dominios desacoplados.", hours: 30, status: "pending" }
];

export default function RoadmapPage() {
  return (
    <DashboardShell>
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-black italic">Personal Roadmap.</h1>
            <p className="text-gray-500 font-medium">Tu ruta crítica hacia la maestría técnica.</p>
          </div>
          <Button className="h-14 px-8 bg-brand-blue rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-apple hover:scale-105 transition-all">
            Generar Nuevo Roadmap
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-8">
           {STEPS.map((step, idx) => (
             <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-apple flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-apple-lg transition-all">
                <div className="flex gap-8 items-center flex-1">
                   <div className="text-5xl font-black text-gray-100 italic group-hover:text-brand-blue/20 transition-colors">0{idx + 1}</div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-black italic">{step.title}</h3>
                      <p className="text-gray-400 font-medium text-sm">{step.desc}</p>
                   </div>
                </div>
                <div className="flex items-center gap-10">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Esfuerzo</span>
                      <div className="flex items-center gap-2 text-black font-bold">
                         <Clock className="h-4 w-4 text-brand-blue" />
                         {step.hours}h
                      </div>
                   </div>
                   <div className={cn(
                     "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                     step.status === "in_progress" ? "bg-brand-blue/10 text-brand-blue" : "bg-gray-50 text-gray-400"
                   )}>
                     {step.status === "in_progress" ? "En curso" : "Pendiente"}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </DashboardShell>
  );
}
