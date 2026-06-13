"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Terminal, Zap, Target, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const metrics = [
    { label: "Evaluaciones", value: "12", color: "bg-brand-blue" },
    { label: "Puntaje Promedio", value: "88%", color: "bg-brand-green" },
    { label: "Vistas Digital Twin", value: "245", color: "bg-brand-purple" },
    { label: "Match de Empleos", value: "18", color: "bg-brand-orange" }
  ];

  return (
    <DashboardShell>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black italic">Dashboard.</h1>
            <p className="text-gray-500 font-medium">Resumen de tu DNA técnico y compatibilidad.</p>
          </div>
          <div className="bg-white shadow-apple px-4 py-2 rounded-full border border-gray-100 text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            STATUS: VERIFIED_MASTER
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <Card key={idx} className="border-none shadow-apple rounded-[2rem] overflow-hidden bg-white group hover:shadow-apple-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black tracking-tighter">{m.value}</div>
                <div className={`h-1.5 w-8 rounded-full mt-4 transition-all group-hover:w-16 ${m.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold tracking-tight text-black italic">Recomendaciones.</h2>
              <Link href="/jobs" className="text-brand-blue text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                Ver todo <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { title: "Senior Fullstack Engineer", company: "Vercel", score: 98, stack: ["React", "Go"] },
                { title: "Frontend Mastermind", company: "Neon Creative", score: 94, stack: ["Next.js", "Three.js"] }
              ].map((job, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-apple flex justify-between items-center group cursor-pointer hover:scale-[1.01] transition-all">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-black group-hover:text-brand-blue transition-colors">{job.title}</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{job.company}</p>
                    <div className="flex gap-2 pt-2">
                      {job.stack.map(s => (
                        <Badge key={s} variant="secondary" className="rounded-full px-3 text-[9px] font-bold bg-gray-50 text-gray-400 uppercase tracking-widest border-none">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-brand-blue tracking-tighter">{job.score}%</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-tight px-2 italic text-black">Próximos Pasos.</h2>
            <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white space-y-8 shadow-apple-lg relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-brand-blue/20 rounded-2xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-brand-blue" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">Optimiza tu DNA.</h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">Completa el módulo de Sistemas Distribuidos para subir tu score un 15%.</p>
                </div>
                <Link href="/line">
                  <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-14 font-bold uppercase tracking-widest text-[10px] mt-4">
                    Ir a The LINE
                  </Button>
                </Link>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-50 space-y-6">
              <h4 className="font-bold text-black italic">Actividad Reciente.</h4>
              <div className="space-y-6">
                {[
                  { icon: Target, label: "Assessment", name: "System Design", val: "92%" },
                  { icon: Users, label: "Job Match", name: "Stripe", val: "99%" }
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      <act.icon className="h-4 w-4 text-brand-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{act.label}</p>
                      <p className="text-sm font-bold text-gray-800">{act.name}</p>
                    </div>
                    <div className="text-right font-black text-brand-blue">{act.val}</div>
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
