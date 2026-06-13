
"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Fingerprint } from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardShell>
      <div className="space-y-8 md:space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Tu Identidad Digital.</h1>
            <p className="text-gray-500 font-medium text-sm">El Digital Twin consolidado por tus Skill Scores.</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50 text-center min-w-[200px]">
            <span className="text-6xl font-black tracking-tighter text-brand-blue leading-none">A+</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] block mt-3 text-gray-300">Verified Master</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 space-y-8">
              <h2 className="text-xl font-bold text-black">Technical DNA (Skill Scores)</h2>
              <div className="space-y-6">
                {["Frontend Architecture", "Systems Design", "DevOps"].map(s => (
                  <div key={s} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-[10px] uppercase tracking-widest text-gray-500">{s}</span>
                      <span className="font-bold text-xl text-brand-blue">94%</span>
                    </div>
                    <Progress value={94} className="h-3 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-12">
             <div className="bg-gray-950 p-10 rounded-[2.5rem] text-white space-y-6 shadow-apple-lg relative overflow-hidden group">
               <Fingerprint className="h-10 w-10 text-brand-blue" />
               <h3 className="text-xl font-bold">Digital Twin Sync</h3>
               <p className="text-sm text-gray-400 font-medium">Tu clon técnico es visible para 40+ empresas activas en Nextape.</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
