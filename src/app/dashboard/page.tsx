
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Users, CheckCircle2, Target, Terminal } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const metrics = [
    { label: "Assessments", value: "12", color: "bg-brand-blue" },
    { label: "Avg Score", value: "88%", color: "bg-brand-green" },
    { label: "Views", value: "245", color: "bg-brand-purple" },
    { label: "Jobs", value: "18", color: "bg-brand-orange" }
  ];

  const recommendedJobs = [
    { title: "Senior Fullstack Engineer", company: "Z-Tech Systems", score: 98, stack: ["React", "Go", "Postgres"] },
    { title: "Frontend Mastermind", company: "Neon Creative", score: 94, stack: ["Next.js", "Three.js", "Tailwind"] },
    { title: "DevOps Architect", company: "Global Cloud", score: 87, stack: ["K8s", "AWS", "Terraform"] }
  ];

  return (
    <div className="space-y-8 md:space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hola, Developer Alpha.</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Aquí está el resumen de tu carrera hoy.</p>
        </div>
        <div className="bg-white shadow-apple px-4 py-2 rounded-full border border-gray-100 text-[10px] md:text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
          Status: Verified Master
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((m, idx) => (
          <Card key={idx} className="border-none shadow-apple rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white hover:shadow-apple-lg transition-all duration-300 group">
            <CardHeader className="pb-1 md:pb-2 p-4 md:p-6">
              <CardTitle className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="text-2xl md:text-4xl font-bold tracking-tighter">{m.value}</div>
              <div className={`h-1 w-6 md:h-1.5 md:w-8 rounded-full mt-2 md:mt-4 transition-all group-hover:w-12 md:group-hover:w-16 ${m.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">Recomendados</h2>
            <Link href="/dashboard/jobs" className="text-brand-blue text-xs md:text-sm font-semibold hover:underline flex items-center gap-1">
              Ver todos <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recommendedJobs.map((job, idx) => (
              <div key={idx} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-gray-50 shadow-apple flex flex-col sm:flex-row justify-between items-center gap-6 hover:scale-[1.01] transition-all cursor-pointer">
                <div className="space-y-2 w-full text-center sm:text-left">
                  <h3 className="text-lg md:text-xl font-bold">{job.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">{job.company}</p>
                  <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                    {job.stack.map(s => (
                      <Badge key={s} variant="secondary" className="rounded-full px-3 py-0.5 text-[9px] font-bold bg-gray-50 text-gray-400 border-none uppercase tracking-widest">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-0 shrink-0 bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl w-full sm:w-auto justify-between sm:justify-center">
                   <div className="text-3xl md:text-5xl font-black tracking-tighter text-brand-blue">{job.score}%</div>
                   <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Action */}
        <div className="space-y-6">
           <h2 className="text-lg md:text-xl font-bold tracking-tight px-2">Actividad</h2>
           <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-apple space-y-6 md:space-y-8 border border-gray-50">
              {[
                { type: "Assessment", name: "System Design", score: "92/100", date: "2h ago", color: "text-brand-blue" },
                { type: "Skill Verified", name: "React Advanced", score: "LEVEL 5", date: "1d ago", color: "text-brand-green" },
                { type: "Job Match", name: "Tech Lead @ Stripe", score: "99%", date: "3d ago", color: "text-brand-orange" }
              ].map((act, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className={`w-1 h-10 md:h-12 rounded-full transition-all group-hover:w-1.5 ${idx === 0 ? "bg-brand-blue" : idx === 1 ? "bg-brand-green" : "bg-brand-orange"}`} />
                  <div className="flex-1">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">{act.type}</p>
                    <p className="font-bold text-gray-800 text-xs md:text-sm">{act.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-xs md:text-sm ${act.color}`}>{act.score}</p>
                    <p className="text-[9px] text-gray-400 font-medium">{act.date}</p>
                  </div>
                </div>
              ))}
           </div>
           
           <Link href="/dashboard/the-line" className="block">
             <div className="bg-gray-950 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white flex justify-between items-center group cursor-pointer hover:bg-black shadow-apple-lg transition-all relative overflow-hidden">
               <div className="relative z-10">
                 <span className="font-bold text-lg md:text-xl block">Enter The LINE</span>
                 <span className="text-[10px] text-gray-500 font-medium opacity-60 tracking-wider">Start Neural Sync</span>
               </div>
               <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                 <Terminal className="h-6 w-6 md:h-7 md:w-7 text-brand-blue" />
               </div>
               <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl" />
             </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
