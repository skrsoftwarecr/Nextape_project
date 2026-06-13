"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Terminal, ShieldAlert, Cpu } from "lucide-react";

export default function TheLinePage() {
  const [status, setStatus] = useState<"idle" | "active">("idle");

  return (
    <DashboardShell>
      <div className="space-y-12 max-w-6xl mx-auto">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-black italic">The LINE.</h1>
          <p className="text-gray-500 font-medium">Evaluación dinámica de arquitectura y respuesta técnica.</p>
        </header>

        {status === "idle" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-apple border border-gray-50 space-y-10">
              <div className="space-y-4">
                 <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                    <Cpu className="h-7 w-7 text-brand-blue" />
                 </div>
                 <h2 className="text-2xl font-bold italic">Configuración Neural.</h2>
                 <p className="text-sm text-gray-400 font-medium">Prepara el entorno de simulación basado en tu stack técnico.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Nivel de Simulación</label>
                  <Select defaultValue="master">
                    <SelectTrigger className="bg-gray-50 border-none h-16 rounded-2xl font-bold text-lg px-6">
                      <SelectValue placeholder="Dificultad" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-apple-lg">
                      <SelectItem value="master">MAESTRO (TAPE-READY)</SelectItem>
                      <SelectItem value="expert">EXPERTO</SelectItem>
                      <SelectItem value="senior">SENIOR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setStatus("active")}
                  className="w-full h-20 bg-gray-950 hover:bg-black text-white rounded-[2rem] text-xl font-bold shadow-apple-lg uppercase tracking-widest"
                >
                  Iniciar Sincronización
                </Button>
              </div>
            </div>

            <div className="bg-brand-blue p-12 rounded-[2.5rem] text-white flex flex-col justify-center space-y-6 shadow-apple-lg relative overflow-hidden">
               <h3 className="text-5xl font-black italic tracking-tighter leading-none">Validación de Élite.</h3>
               <p className="text-lg opacity-80 font-medium leading-relaxed">Cada pregunta en The LINE es única, generada por IA para medir cómo piensas, no qué memorizaste.</p>
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-[100] bg-black text-white p-12 flex flex-col items-center justify-center space-y-12">
            <div className="flex items-center gap-4 animate-pulse">
               <Terminal className="h-10 w-10 text-brand-blue" />
               <h2 className="text-4xl font-black italic tracking-tighter">THE_LINE_ENV_01</h2>
            </div>
            <div className="max-w-2xl w-full p-12 bg-white/5 rounded-[3rem] border border-white/10 space-y-8 backdrop-blur-3xl">
               <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">Situación Crítica</span>
                  <p className="text-2xl font-bold leading-tight">Se detecta una latencia inusual en el pool de conexiones de la base de datos distribuida durante el escalado horizontal.</p>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {["Implementar Read-Replicas", "Aumentar Timeout de Conexión", "Optimizar Queries Pesadas", "Revisar Configuración de VPC"].map((opt, i) => (
                    <Button key={i} variant="outline" className="h-16 rounded-2xl border-white/10 text-white hover:bg-white/10 justify-start px-8 font-bold text-lg">
                      {i + 1}. {opt}
                    </Button>
                  ))}
               </div>
            </div>
            <Button onClick={() => setStatus("idle")} variant="ghost" className="text-white/40 hover:text-white uppercase tracking-widest font-bold text-xs">Finalizar Sesión</Button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}