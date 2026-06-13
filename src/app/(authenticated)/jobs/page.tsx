
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";

const JOBS = [
  { id: 1, title: "Lead Frontend Engineer", company: "Vercel", location: "Remote", type: "Full-time", salary: "$180k-$220k", date: "2d ago", stack: ["React", "Next.js", "TypeScript"], match: 98 },
  { id: 2, title: "Backend Architect", company: "Prisma", location: "Berlin / Remote", type: "Contract", salary: "$120k-$150k", date: "4d ago", stack: ["Rust", "Postgres", "GraphQL"], match: 92 },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Oportunidades.</h1>
        <p className="text-gray-500 font-medium">Posiciones curadas según tu perfil técnico.</p>
      </header>

      <div className="space-y-6">
        {JOBS.map((job) => (
          <div key={job.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border border-gray-50 shadow-apple hover:shadow-apple-lg transition-all group">
            <div className="flex-grow space-y-6 w-full">
              <div>
                <h2 className="text-2xl font-bold group-hover:text-brand-blue transition-colors">{job.title}</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{job.company}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.stack.map(s => (
                  <Badge key={s} className="bg-gray-50 text-gray-400 border-none rounded-full py-1.5 px-4 text-[9px] font-bold uppercase tracking-widest">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
               <div className="text-4xl font-black text-brand-blue tracking-tighter">{job.match}%</div>
               <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
