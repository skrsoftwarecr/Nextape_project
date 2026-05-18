
"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Terminal, Award, FileText, Code2 } from "lucide-react";

const SKILLS = [
  { name: "Core JavaScript / TypeScript", value: 92 },
  { name: "React / Frontend Ecosystem", value: 88 },
  { name: "Backend Architecture", value: 75 },
  { name: "DevOps & CI/CD", value: 64 },
  { name: "Testing & QA", value: 81 },
  { name: "UI/UX Implementation", value: 94 }
];

const ASSESSMENT_HISTORY = [
  { name: "The LINE: Frontend Master", score: 98, date: "Oct 24, 2024", badge: "Expert" },
  { name: "React Performance Audit", score: 91, date: "Oct 12, 2024", badge: "Advanced" },
  { name: "System Scalability", score: 84, date: "Sep 28, 2024", badge: "Proficient" }
];

export default function ProfilePage() {
  return (
    <div className="space-y-16">
      <header className="border-b-4 border-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-headline font-black uppercase italic tracking-tighter">Profile.</h1>
          <p className="text-xl font-bold uppercase opacity-60">Verified Developer Identity.</p>
        </div>
        <div className="bg-secondary text-white p-6 border-4 border-black flex flex-col items-center min-w-48">
          <span className="text-5xl font-headline font-black leading-none">A+</span>
          <span className="text-[10px] font-black uppercase tracking-widest mt-2">Overall Grade</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Info & Stats */}
        <div className="lg:col-span-2 space-y-12">
          {/* Personal Info */}
          <div className="space-y-8">
            <h2 className="text-4xl font-headline font-black uppercase tracking-tighter italic">Technical DNA.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-4 border-black p-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Primary Language</span>
                <p className="text-xl font-bold uppercase">TypeScript / Rust</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Specialty</span>
                <p className="text-xl font-bold uppercase">UI Architecture</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Experience Level</span>
                <p className="text-xl font-bold uppercase">Senior (7+ Years)</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Location</span>
                <p className="text-xl font-bold uppercase">Remote / Worldwide</p>
              </div>
            </div>
          </div>

          {/* Skill Metrics */}
          <div className="space-y-8">
            <h2 className="text-4xl font-headline font-black uppercase tracking-tighter italic">Verified Metrics.</h2>
            <div className="space-y-8">
              {SKILLS.map((skill) => (
                <div key={skill.name} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-bold uppercase tracking-widest text-sm">{skill.name}</span>
                    <span className="font-headline font-black text-2xl text-primary">{skill.value}%</span>
                  </div>
                  <div className="h-6 border-2 border-black bg-muted p-1 relative">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${skill.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: History & Badges */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-4xl font-headline font-black uppercase tracking-tighter italic">The LINE Records.</h2>
            <div className="space-y-4">
              {ASSESSMENT_HISTORY.map((item, idx) => (
                <div key={idx} className="border-4 border-black p-6 bg-black text-white hover:bg-accent hover:text-black transition-all cursor-default">
                  <div className="flex justify-between items-start mb-4">
                    <Terminal className="h-6 w-6" />
                    <span className="text-3xl font-headline font-black italic">{item.score}</span>
                  </div>
                  <p className="font-bold uppercase tracking-tight text-lg mb-1">{item.name}</p>
                  <p className="text-xs font-bold opacity-60 mb-4">{item.date}</p>
                  <Badge className="bg-white text-black rounded-none font-black uppercase text-[10px] tracking-widest px-3 py-1">
                    {item.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary p-8 border-4 border-black text-white space-y-4">
             <Award className="h-10 w-10 text-accent" />
             <h3 className="text-2xl font-headline font-black uppercase tracking-tighter italic">Next Steps.</h3>
             <p className="text-sm font-bold opacity-80 leading-relaxed">
               You are currently in the top 5% of React developers. Complete the "Advanced Distributed Systems" assessment to unlock Tier 1 job matches.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
