
"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MOCK_DNA = {
  grade: "A+",
  skills: [
    { name: "Frontend Architecture", value: 94 },
    { name: "Systems Design", value: 82 },
    { name: "Algorithmic Efficiency", value: 88 },
  ],
  traits: ["Resolutivo", "Arquitecto", "Escalable"]
};

export default function DigitalTwinPage() {
  return (
    <DashboardShell>
      <div className="space-y-10">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-black">Digital Twin.</h1>
          <p className="text-gray-500 font-medium">Tu representación técnica verificada por IA.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[2.5rem] shadow-apple border-none overflow-hidden bg-white">
              <CardHeader className="bg-brand-blue/5 p-8 text-center space-y-4">
                <div className="w-24 h-24 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-apple-lg border border-brand-blue/10">
                  <Fingerprint className="h-12 w-12 text-brand-blue" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black italic tracking-tighter text-brand-blue">ALPHA_01</CardTitle>
                  <Badge className="bg-brand-blue text-white rounded-full border-none px-4 py-1 text-[10px] uppercase tracking-widest mt-2">Verified Expert</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</span>
                  <span className="text-sm font-bold text-brand-green flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" /> ACTIVO
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Match Global</span>
                  <span className="text-2xl font-black tracking-tighter text-brand-blue">{MOCK_DNA.grade}</span>
                </div>
                <div className="pt-4 flex flex-wrap gap-2">
                  {MOCK_DNA.traits.map(t => (
                    <Badge key={t} className="bg-gray-50 text-gray-400 border-none rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-widest">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-10 shadow-apple border border-gray-50 space-y-8">
                <div className="flex items-center gap-4">
                   <Zap className="h-6 w-6 text-brand-blue" />
                   <h2 className="text-xl font-bold text-black">DNA Técnico Verificado</h2>
                </div>
                <div className="space-y-8">
                  {MOCK_DNA.skills.map((skill) => (
                    <div key={skill.name} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-[11px] uppercase tracking-widest text-gray-500">{skill.name}</span>
                        <span className="font-bold text-xl text-brand-blue">{skill.value}%</span>
                      </div>
                      <Progress value={skill.value} className="h-3 rounded-full bg-gray-50 border border-gray-100" />
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
