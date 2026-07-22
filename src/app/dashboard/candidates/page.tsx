"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Briefcase, ShieldCheck, PlusCircle, Trophy } from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { JobService } from "@/services/jobs.service";
import { CompatibilityService } from "@/services/compatibility.service";
import type { JobOpportunity, CandidateMatch } from "@/types/job.types";

type VacancyRow = JobOpportunity & { id: string };

export default function CandidatesPage() {
  const { user, authLoading } = useAuthUser();
  const [vacancies, setVacancies] = useState<VacancyRow[]>([]);
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [jobs, candidateMatches] = await Promise.all([
          JobService.getJobsByRecruiter(user.uid),
          CompatibilityService.getMatchesForRecruiter(user.uid),
        ]);
        setVacancies(jobs as VacancyRow[]);
        setMatches(candidateMatches);
      } catch (error) {
        console.error("Error fetching candidates data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  // Candidatos verificados = personas distintas que han completado una prueba de mis vacantes.
  const verifiedCandidates = new Set(matches.map((m) => m.userId)).size;
  // Candidatos por vacante, rankeados por su resultado en The LINE.
  const matchesByJob = new Map<string, CandidateMatch[]>();
  for (const m of matches) {
    const list = matchesByJob.get(m.jobId) ?? [];
    list.push(m);
    matchesByJob.set(m.jobId, list);
  }
  for (const list of matchesByJob.values()) {
    list.sort((a, b) => b.score - a.score);
  }

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-black italic">Candidatos.</h1>
        <p className="text-gray-500 font-medium">
          Talento que ha completado la prueba técnica (The LINE) de tus vacantes, rankeado por su DNA verificado.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50">
          <Briefcase className="h-5 w-5 text-brand-blue mb-4" />
          <span className="text-4xl font-black italic tracking-tighter">{vacancies.length}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Vacantes activas</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50">
          <Users className="h-5 w-5 text-brand-green mb-4" />
          <span className="text-4xl font-black italic tracking-tighter">{matches.length}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Aplicaciones totales</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50">
          <ShieldCheck className="h-5 w-5 text-brand-purple mb-4" />
          <span className="text-4xl font-black italic tracking-tighter">{verifiedCandidates}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">DNA verificados</p>
        </div>
      </div>

      {vacancies.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center space-y-6">
          <Users className="h-12 w-12 text-gray-200" />
          <div className="space-y-2">
            <p className="text-xl font-bold text-black italic">Aún no hay candidatos.</p>
            <p className="text-sm text-gray-400 max-w-md">
              Publica una vacante con su prueba técnica para empezar a recibir talento con DNA verificado.
            </p>
          </div>
          <Link href="/dashboard/vacancies/new">
            <Button className="bg-black text-white rounded-xl uppercase tracking-widest text-[10px] font-bold">
              <PlusCircle className="mr-2 h-4 w-4" /> Publicar Vacante
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {vacancies.map((job) => {
            const jobMatches = matchesByJob.get(job.id) ?? [];
            return (
              <div key={job.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-50 shadow-apple space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold italic leading-none">{job.title}</h2>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(job.requiredSkills || []).map((s) => (
                        <Badge key={s} className="bg-brand-blue/5 text-brand-blue border-none rounded-full py-1.5 px-4 text-[8px] font-bold uppercase tracking-widest">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black italic tracking-tighter">{jobMatches.length}</span>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Candidatos</p>
                  </div>
                </div>

                {jobMatches.length === 0 ? (
                  <div className="pt-6 border-t border-gray-50">
                    <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gray-300" />
                      Aún nadie ha completado la prueba de esta vacante. Los candidatos aparecerán aquí rankeados por su DNA.
                    </p>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-gray-50 space-y-3">
                    {jobMatches.map((m, idx) => (
                      <div key={m.userId} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 md:p-5">
                        <div className="flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-white shadow-apple text-sm font-black italic text-gray-400">
                          {idx === 0 ? <Trophy className="h-4 w-4 text-brand-orange" /> : idx + 1}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold italic leading-tight truncate">{m.candidateName}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {Object.entries(m.skills || {}).map(([skill, val]) => (
                              <Badge key={skill} className="bg-white text-gray-500 border-none rounded-full py-1 px-3 text-[8px] font-bold uppercase tracking-widest">
                                {skill} {val}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black italic tracking-tighter text-brand-blue">{m.score}%</div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">The LINE</p>
                        </div>
                        <div className="text-right shrink-0 hidden sm:block border-l border-gray-200 pl-4">
                          <div className="text-2xl font-black italic tracking-tighter">{m.matchPercent}%</div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Afinidad CORE</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
