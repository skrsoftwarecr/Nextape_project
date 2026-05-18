
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JOBS = [
  { id: 1, title: "Lead Frontend Engineer", company: "Vercel", location: "Remote", type: "Full-time", salary: "$180k-$220k", date: "2d ago", stack: ["React", "Next.js", "TypeScript"], match: 98 },
  { id: 2, title: "Backend Architect", company: "Prisma", location: "Berlin / Remote", type: "Contract", salary: "$120k-$150k", date: "4d ago", stack: ["Rust", "Postgres", "GraphQL"], match: 92 },
  { id: 3, title: "Senior Product Engineer", company: "Linear", location: "San Francisco", type: "Full-time", salary: "$200k+", date: "1w ago", stack: ["Clojure", "React", "Node"], match: 88 },
  { id: 4, title: "Platform Engineer", company: "Fly.io", location: "Remote", type: "Full-time", salary: "$160k-$210k", date: "3d ago", stack: ["Go", "Docker", "Linux"], match: 85 },
  { id: 5, title: "Software Engineer III", company: "Stripe", location: "New York / Remote", type: "Full-time", salary: "$190k-$240k", date: "5d ago", stack: ["Ruby", "AWS", "Postgres"], match: 79 },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Oportunidades.</h1>
        <p className="text-gray-500 font-medium">Posiciones curadas según tu perfil técnico.</p>
      </header>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-white p-6 rounded-[2rem] shadow-apple border border-gray-50">
        <div className="lg:col-span-4 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Búsqueda</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rol, empresa o tecnología..." 
              className="pl-12 bg-gray-50 border-none h-14 rounded-2xl font-medium focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Modality</label>
          <Select>
            <SelectTrigger className="bg-gray-50 border-none h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest">
              <SelectValue placeholder="CUALQUIERA" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-apple-lg">
              <SelectItem value="remote">REMOTE</SelectItem>
              <SelectItem value="onsite">ON-SITE</SelectItem>
              <SelectItem value="hybrid">HYBRID</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Level</label>
          <Select>
            <SelectTrigger className="bg-gray-50 border-none h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest">
              <SelectValue placeholder="CUALQUIERA" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-apple-lg">
              <SelectItem value="junior">JUNIOR</SelectItem>
              <SelectItem value="mid">MID-LEVEL</SelectItem>
              <SelectItem value="senior">SENIOR</SelectItem>
              <SelectItem value="lead">LEAD / PRINCIPAL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-4">
          <Button className="w-full h-14 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-bold uppercase tracking-[0.2em] text-xs shadow-apple transition-all">
            Actualizar Feed
          </Button>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="space-y-6">
        {JOBS.map((job) => (
          <div key={job.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border border-gray-50 shadow-apple hover:shadow-apple-lg transition-all cursor-pointer group">
            <div className="flex-grow space-y-6 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold group-hover:text-brand-blue transition-colors">{job.title}</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{job.company}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-4xl font-black text-brand-blue tracking-tighter">{job.match}%</div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Match Score</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-50">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <MapPin className="h-4 w-4 text-brand-blue/40" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <Briefcase className="h-4 w-4 text-brand-blue/40" /> {job.type}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <DollarSign className="h-4 w-4 text-brand-blue/40" /> {job.salary}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <Clock className="h-4 w-4 text-brand-blue/40" /> {job.date}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.stack.map(s => (
                  <Badge key={s} className="bg-gray-50 text-gray-400 hover:bg-brand-blue/10 hover:text-brand-blue border-none rounded-full py-1.5 px-4 text-[9px] font-bold uppercase tracking-widest transition-colors">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="md:w-40 flex flex-col gap-3 w-full shrink-0">
              <Button className="rounded-2xl bg-black text-white h-14 uppercase font-bold tracking-widest text-[10px] shadow-apple-lg hover:bg-gray-900 transition-all">
                Ver Detalles
              </Button>
              <div className="md:hidden flex justify-between items-center bg-gray-50 p-6 rounded-[1.5rem]">
                 <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Match Score</span>
                 <span className="text-3xl font-black text-brand-blue">{job.match}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
