"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Briefcase, ShieldCheck, PlusCircle } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuthUser } from "@/hooks/use-auth-user";
import type { JobOpportunity } from "@/types";

type VacancyRow = JobOpportunity & { id: string };

export default function CandidatesPage() {
  const { user, authLoading } = useAuthUser();
  const [vacancies, setVacancies] = useState<VacancyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchVacancies = async () => {
      try {
        const q = query(
          collection(db, "jobs"),
          where("createdBy", "==", user.uid),
          orderBy("postedAt", "desc")
        );
        const snap = await getDocs(q);
        setVacancies(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as VacancyRow)));
      } catch (error) {
        console.error("Error fetching vacancies for candidates view:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [user, authLoading]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const totalApplicants = vacancies.reduce((sum, v) => sum + (v.applicantsCount || 0), 0);

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
          <span className="text-4xl font-black italic tracking-tighter">{totalApplicants}</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Aplicantes totales</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-apple border border-gray-50">
          <ShieldCheck className="h-5 w-5 text-brand-purple mb-4" />
          <span className="text-4xl font-black italic tracking-tighter">—</span>
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
          {vacancies.map((job) => (
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
                  <span className="text-3xl font-black italic tracking-tighter">{job.applicantsCount || 0}</span>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Aplicantes</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50">
                <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-gray-300" />
                  El ranking por DNA verificado se activará cuando el pipeline de evaluación en servidor esté disponible.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
