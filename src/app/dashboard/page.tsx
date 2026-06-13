
"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Fingerprint, Target, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const metrics = [
    { label: "DNA Integrity", value: "94%", color: "bg-brand-blue" },
    { label: "Exámenes Realizados", value: "8", color: "bg-brand-green" },
    { label: "Digital Twin Sync", value: "Live", color: "bg-brand-purple" },
    { label: "Match de Empleos", value: "22", color: "bg-brand-orange" }
  ];

  return (
    <DashboardShell>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black italic">Dashboard.</h1>
            <p className="text-gray-500 font-medium">Métricas clave de tu identidad técnica Nextape.</p>
          </div>
          <div className="bg-white shadow-apple px-6 py-3 rounded-full border border-gray-100 text-[10px] font-bold flex items-center gap-3">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            IDENTIDAD_VERIFICADA: ALPHA_SYNC_ACTIVE
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <Card key={idx} className="border-none shadow-apple rounded-[2rem] overflow-hidden bg-white group hover:shadow-apple-lg transition-all border border-gray-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{m.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black tracking-tighter italic">{m.value}</div>
                <div className={`h-1.5 w-8 rounded-full mt-4 transition-all group-hover:w-16 ${m.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold tracking-tight text-black italic">Matches de Alta Fidelidad.</h2>
              <Link href="/jobs" className="text-brand-blue text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                Ver feed <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { title: "Senior Backend Engineer", company: "Prisma", score: 92, stack: ["Rust", "PostgreSQL"] },
                { title: "Lead Product Engineer", company: "Linear", score: 87, stack: ["React", "TypeScript"] }
              ].map((job, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-apple flex justify-between items-center group cursor-pointer hover:scale-[1.01] transition-all">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-black group-hover:text-brand-blue transition-colors italic">{job.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.company}</p>
                    <div className="flex gap-2 pt-2">
                      {job.stack.map(s => (
                        <Badge key={s} variant="secondary" className="rounded-full px-4 py-1 text-[8px] font-bold bg-gray-50 text-gray-400 uppercase tracking-widest border-none">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-brand-blue tracking-tighter italic">{job.score}%</div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Match Accuracy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-tight px-2 italic text-black">Telemetría Digital.</h2>
            <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white space-y-8 shadow-apple-lg relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-brand-blue/20 rounded-2xl flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold italic tracking-tight">Tu Digital Twin está vivo.</h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    Hemos sincronizado tu perfil con 24 vacantes nuevas. Completa el examen de Sistemas Distribuidos para aumentar tu visibilidad.
                  </p>
                </div>
                <Link href="/line">
                  <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-14 font-bold uppercase tracking-widest text-[10px] mt-4 active:scale-95 transition-all">
                    Iniciar THE LINE
                  </Button>
                </Link>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-50 space-y-6">
              <h4 className="font-bold text-black italic text-sm">Próximos Hitos.</h4>
              <div className="space-y-6">
                {[
                  { icon: Target, label: "Assessment", name: "Arquitectura Senior", val: "92%" },
                  { icon: Users, label: "Job Match", name: "Stripe", val: "99%" }
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      <act.icon className="h-4 w-4 text-brand-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{act.label}</p>
                      <p className="text-sm font-bold text-gray-800">{act.name}</p>
                    </div>
                    <div className="text-right font-black text-brand-blue italic">{act.val}</div>
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
