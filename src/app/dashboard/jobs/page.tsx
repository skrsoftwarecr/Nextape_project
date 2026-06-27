"use client";

import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JOBS = [
  { id: 1, title: "Lead Frontend Engineer", company: "Vercel", location: "Remote", type: "Full-time", salary: "$180k-$220k", date: "2d ago", stack: ["React", "Next.js", "TypeScript"], match: 98 },
  { id: 2, title: "Backend Architect", company: "Prisma", location: "Berlin / Remote", type: "Contract", salary: "$120k-$150k", date: "4d ago", stack: ["Rust", "Postgres", "GraphQL"], match: 92 },
];

export default function JobsPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-black italic">Oportunidades.</h1>
        <p className="text-gray-500 font-medium">Posiciones curadas según tu perfil técnico.</p>
      </header>

      <div className="flex gap-4 items-center bg-white p-6 rounded-[2rem] shadow-apple border border-gray-50">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar por rol, empresa o stack..." className="pl-12 bg-gray-50 border-none h-14 rounded-2xl" />
        </div>
        <Button className="h-14 px-8 bg-brand-blue rounded-2xl font-bold uppercase tracking-widest text-xs">Filtrar</Button>
      </div>

      <div className="space-y-6">
        {JOBS.map((job) => (
          <div key={job.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border border-gray-50 shadow-apple hover:shadow-apple-lg transition-all group cursor-pointer">
            <div className="flex-grow space-y-6 w-full">
              <div>
                <h2 className="text-2xl font-bold group-hover:text-brand-blue transition-colors text-black leading-none italic">{job.title}</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">{job.company}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-blue" /> {job.location}</div>
                <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-brand-blue" /> {job.type}</div>
                <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-brand-blue" /> {job.salary}</div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-blue" /> {job.date}</div>
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
               <div className="text-4xl font-black text-brand-blue tracking-tighter italic">{job.match}%</div>
               <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
