"use client";

import { Fingerprint, Zap, Target, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CorePage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
           <Activity className="h-3 w-3" /> Identidad Verificada
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-black italic">CORE.</h1>
        <p className="text-gray-500 font-medium text-sm">Tu motor de proyección digital y DNA técnico central.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-12 rounded-[3rem] shadow-apple border border-gray-50 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]">
           <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center relative">
              <Fingerprint className="h-12 w-12 text-brand-blue" />
              <div className="absolute inset-0 rounded-full border-2 border-brand-blue border-t-transparent animate-spin opacity-20" />
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl font-black italic tracking-tighter">Sincronización en curso.</h2>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
                Tu representación técnica CORE se está generando mediante el análisis de tus evaluaciones en The LINE y tu actividad en GitHub.
              </p>
           </div>
           <div className="flex gap-3">
              <Badge className="bg-gray-50 text-gray-400 border-none rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest">IA_ANALYSIS_ST_01</Badge>
              <Badge className="bg-gray-50 text-gray-400 border-none rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest">DNA_SYNCING</Badge>
           </div>
        </div>

        <div className="space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-apple p-8 space-y-6">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                 <Zap className="h-6 w-6 text-brand-blue" />
              </div>
              <div className="space-y-2">
                 <h4 className="font-bold text-xl">Potencial.</h4>
                 <p className="text-sm text-gray-400 font-medium leading-relaxed italic">"Tu arquitectura en la simulación de Node.js superó al 94% de los perfiles analizados."</p>
              </div>
           </Card>

           <Card className="rounded-[2.5rem] border-none shadow-apple p-8 space-y-6 bg-black text-white">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-blue">
                 <Target className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                 <h4 className="font-bold text-xl">Visibilidad.</h4>
                 <p className="text-sm text-gray-400 font-medium leading-relaxed">Activa el CORE público para que empresas Tier 1 puedan invitarte directamente a sus equipos.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
