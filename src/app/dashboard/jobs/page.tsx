
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
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
      <header className="border-b-4 border-black pb-8">
        <h1 className="text-6xl font-headline font-black uppercase italic tracking-tighter">Jobs.</h1>
        <p className="text-xl font-bold uppercase opacity-60">Positions matched via technical DNA.</p>
      </header>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-4 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Keywords</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
            <Input 
              placeholder="Search roles, companies, tech..." 
              className="pl-12 border-4 border-black rounded-none h-14 font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Modality</label>
          <Select>
            <SelectTrigger className="border-4 border-black rounded-none h-14 font-bold uppercase text-xs tracking-widest">
              <SelectValue placeholder="ANY MODALITY" />
            </SelectTrigger>
            <SelectContent className="border-2 border-black rounded-none font-bold">
              <SelectItem value="remote">REMOTE</SelectItem>
              <SelectItem value="onsite">ON-SITE</SelectItem>
              <SelectItem value="hybrid">HYBRID</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Level</label>
          <Select>
            <SelectTrigger className="border-4 border-black rounded-none h-14 font-bold uppercase text-xs tracking-widest">
              <SelectValue placeholder="ANY LEVEL" />
            </SelectTrigger>
            <SelectContent className="border-2 border-black rounded-none font-bold">
              <SelectItem value="junior">JUNIOR</SelectItem>
              <SelectItem value="mid">MID-LEVEL</SelectItem>
              <SelectItem value="senior">SENIOR</SelectItem>
              <SelectItem value="lead">LEAD / PRINCIPAL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Developer Type</label>
          <Select>
            <SelectTrigger className="border-4 border-black rounded-none h-14 font-bold uppercase text-xs tracking-widest">
              <SelectValue placeholder="ALL TYPES" />
            </SelectTrigger>
            <SelectContent className="border-2 border-black rounded-none font-bold">
              <SelectItem value="frontend">FRONTEND</SelectItem>
              <SelectItem value="backend">BACKEND</SelectItem>
              <SelectItem value="fullstack">FULLSTACK</SelectItem>
              <SelectItem value="mobile">MOBILE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:col-span-2">
          <Button className="w-full h-14 rounded-none bg-primary border-4 border-black font-black uppercase tracking-widest">
            Update Feed
          </Button>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="space-y-8">
        {JOBS.map((job) => (
          <div key={job.id} className="border-4 border-black p-8 flex flex-col md:flex-row gap-8 items-start hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-background">
            <div className="flex-grow space-y-4 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-headline font-black uppercase group-hover:text-primary transition-colors">{job.title}</h2>
                  <p className="text-lg font-bold uppercase tracking-widest text-secondary">{job.company}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-4xl font-headline font-black text-primary">{job.match}%</div>
                  <div className="text-[10px] font-black uppercase tracking-tighter opacity-40">Match Score</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-black/10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                  <MapPin className="h-4 w-4" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                  <Briefcase className="h-4 w-4" /> {job.type}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                  <DollarSign className="h-4 w-4" /> {job.salary}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                  <Clock className="h-4 w-4" /> {job.date}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.stack.map(s => (
                  <Badge key={s} className="bg-black text-white rounded-none py-1 px-3 text-[10px] font-bold uppercase tracking-widest">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="md:w-32 flex flex-col gap-2 w-full md:items-end self-stretch justify-center">
              <Button className="rounded-none bg-black text-white h-12 uppercase font-black tracking-widest text-xs border-b-4 border-r-4 border-primary">
                View Details
              </Button>
              <div className="md:hidden flex justify-between items-center bg-muted p-4 border-2 border-black mt-4">
                 <span className="font-bold uppercase tracking-widest text-xs">Compatibility Score</span>
                 <span className="text-3xl font-headline font-black text-primary">{job.match}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
