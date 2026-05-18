"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Users, CheckCircle2, Target, Terminal } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const metrics = [
    { label: "Assessments", value: "12", icon: CheckCircle2, color: "bg-brand-blue" },
    { label: "Avg Score", value: "88%", icon: Target, color: "bg-brand-green" },
    { label: "Views", value: "245", icon: Users, color: "bg-brand-purple" },
    { label: "Jobs", value: "18", icon: TrendingUp, color: "bg-brand-orange" }
  ];

  const recommendedJobs = [
    { title: "Senior Fullstack Engineer", company: "Z-Tech Systems", score: 98, stack: ["React", "Go", "Postgres"] },
    { title: "Frontend Mastermind", company: "Neon Creative", score: 94, stack: ["Next.js", "Three.js", "Tailwind"] },
    { title: "DevOps Architect", company: "Global Cloud", score: 87, stack: ["K8s", "AWS", "Terraform"] }
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hola, Developer Alpha.</h1>
          <p className="text-gray-500 font-medium">Aquí está el resumen de tu carrera hoy.</p>
        </div>
        <div className="bg-white shadow-apple px-4 py-2 rounded-full border border-gray-100 text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
          Status: Verified Master
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="border-none shadow-apple rounded-3xl overflow-hidden bg-white hover:shadow-apple-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.label}</CardTitle>
              <div className={`${m.color} p-2 rounded-xl text-white`}>
                <m.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recomendados para ti</h2>
            <Link href="/dashboard/jobs" className="text-brand-blue text-sm font-semibold hover:underline flex items-center gap-1">
              Ver todos <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recommendedJobs.map((job, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-apple flex flex-col md:flex-row justify-between items-center gap-4 hover:scale-[1.01] transition-all cursor-pointer">
                <div className="space-y-1 w-full text-center md:text-left">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{job.company}</p>
                  <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                    {job.stack.map(s => (
                      <Badge key={s} variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-semibold bg-gray-50 text-gray-600 border-none">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center shrink-0">
                   <div className="text-4xl font-bold text-brand-blue">{job.score}%</div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Action */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold tracking-tight">Actividad reciente</h2>
           <div className="bg-white rounded-3xl p-6 shadow-apple space-y-6 border border-gray-50">
              {[
                { type: "Assessment", name: "System Design", score: "92/100", date: "2h ago", color: "text-brand-blue" },
                { type: "Skill Verified", name: "React Advanced", score: "LEVEL 5", date: "1d ago", color: "text-brand-green" },
                { type: "Job Match", name: "Tech Lead @ Stripe", score: "99%", date: "3d ago", color: "text-brand-orange" }
              ].map((act, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-1 h-10 rounded-full ${idx === 0 ? "bg-brand-blue" : idx === 1 ? "bg-brand-green" : "bg-brand-orange"}`} />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{act.type}</p>
                    <p className="font-bold text-gray-800 text-sm">{act.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${act.color}`}>{act.score}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{act.date}</p>
                  </div>
                </div>
              ))}
           </div>
           
           <Link href="/dashboard/the-line" className="block">
             <div className="bg-gray-950 rounded-3xl p-6 text-white flex justify-between items-center group cursor-pointer hover:bg-black shadow-apple-lg transition-all">
               <div>
                 <span className="font-bold text-lg block">Enter The LINE</span>
                 <span className="text-xs text-gray-500 font-medium italic opacity-60 tracking-wider">Cinematic Assessment</span>
               </div>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Terminal className="h-6 w-6 text-brand-blue" />
               </div>
             </div>
           </Link>
        </div>
      </div>
    </div>
  );
}