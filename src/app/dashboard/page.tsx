
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Users, CheckCircle2, Target, Terminal } from "lucide-react";

export default function DashboardPage() {
  const metrics = [
    { label: "Completed Assessments", value: "12", icon: CheckCircle2, color: "bg-primary" },
    { label: "Average Score", value: "88%", icon: Target, color: "bg-secondary" },
    { label: "Profile Views", value: "245", icon: Users, color: "bg-accent" },
    { label: "Compatible Jobs", value: "18", icon: TrendingUp, color: "bg-black" }
  ];

  const recommendedJobs = [
    { title: "Senior Fullstack Engineer", company: "Z-Tech Systems", score: 98, stack: ["React", "Go", "Postgres"] },
    { title: "Frontend Mastermind", company: "Neon Creative", score: 94, stack: ["Next.js", "Three.js", "Tailwind"] },
    { title: "DevOps Architect", company: "Global Cloud", score: 87, stack: ["K8s", "AWS", "Terraform"] }
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-8">
        <div>
          <h1 className="text-6xl font-headline font-black uppercase italic tracking-tighter">Panel.</h1>
          <p className="text-xl font-bold uppercase opacity-60">Welcome back, Developer Alpha.</p>
        </div>
        <div className="bg-accent px-6 py-2 border-2 border-black font-bold uppercase tracking-widest text-sm flex items-center gap-3">
          Status: Verified Master
          <CheckCircle2 className="h-4 w-4" />
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <Card key={idx} className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">{m.label}</CardTitle>
              <m.icon className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-headline font-black">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-4xl font-headline font-black uppercase tracking-tighter italic flex items-center gap-4">
            Recommended Positions <ArrowUpRight className="h-8 w-8" />
          </h2>
          <div className="space-y-4">
            {recommendedJobs.map((job, idx) => (
              <div key={idx} className="border-4 border-black p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-muted transition-colors">
                <div className="space-y-2 w-full">
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{job.title}</h3>
                  <p className="font-bold opacity-60 uppercase tracking-widest text-sm">{job.company}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.stack.map(s => (
                      <Badge key={s} variant="outline" className="border-2 border-black rounded-none font-bold uppercase text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                   <div className="text-5xl font-headline font-black text-primary">{job.score}%</div>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assessment Activity */}
        <div className="space-y-6">
           <h2 className="text-4xl font-headline font-black uppercase tracking-tighter italic">Recent Activity.</h2>
           <div className="border-4 border-black p-8 bg-black text-white space-y-8">
              {[
                { type: "Assessment", name: "System Design", score: "92/100", date: "2h ago" },
                { type: "Skill Verified", name: "React Advanced", score: "LEVEL 5", date: "1d ago" },
                { type: "Job Match", name: "Tech Lead @ Stripe", score: "99% MATCH", date: "3d ago" }
              ].map((act, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-white/20 pb-4 last:border-0 last:pb-0">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent">{act.type}</span>
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-bold">{act.name}</span>
                    <span className="font-headline italic text-primary">{act.score}</span>
                  </div>
                  <span className="text-xs opacity-40 font-bold">{act.date}</span>
                </div>
              ))}
           </div>
           <div className="bg-secondary p-6 border-4 border-black text-white flex justify-between items-center group cursor-pointer hover:bg-secondary/90">
             <span className="font-black uppercase tracking-widest italic text-lg">Enter The LINE</span>
             <Terminal className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
           </div>
        </div>
      </div>
    </div>
  );
}
