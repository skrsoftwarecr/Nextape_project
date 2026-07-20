"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Loader2, Users, Calendar, ArrowRight, MoreVertical, Terminal, Briefcase } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuthUser } from "@/hooks/use-auth-user";

/** Formatea de forma segura un campo de fecha de Firestore que podría no ser un Timestamp. */
function formatPostedAt(value: unknown): string {
  if (value instanceof Timestamp) {
    return format(value.toDate(), "d MMM, yyyy", { locale: es });
  }
  return "—";
}

export default function VacanciesPage() {
  const { user, authLoading } = useAuthUser();
  const [vacancies, setVacancies] = useState<any[]>([]);
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
        setVacancies(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching vacancies:", error);
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

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-black italic">Mis Vacantes.</h1>
          <p className="text-gray-500 font-medium">Gestiona tus posiciones activas y las pruebas técnicas asociadas.</p>
        </div>
        <Link href="/dashboard/vacancies/new">
          <Button className="h-14 px-8 bg-brand-blue rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-apple hover:scale-105 transition-all text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Publicar Vacante
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {vacancies.length > 0 ? vacancies.map((job) => (
          <div key={job.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-50 shadow-apple flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-apple-lg transition-all">
            <div className="flex-grow space-y-6 w-full">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h2 className="text-2xl font-bold italic leading-none">{job.title}</h2>
                     <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatPostedAt(job.postedAt)}</span>
                        <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {job.applicantsCount || 0} aplicantes</span>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-4 w-4 text-gray-300" /></Button>
               </div>

               <div className="flex flex-wrap gap-2">
                  {(job.requiredSkills || []).map((s: string) => (
                    <Badge key={s} className="bg-brand-blue/5 text-brand-blue border-none rounded-full py-1.5 px-4 text-[8px] font-bold uppercase tracking-widest">
                      {s}
                    </Badge>
                  ))}
               </div>

               <div className="pt-6 border-t border-gray-50 flex gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl flex-1">
                     <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 block mb-1">Status de Prueba</span>
                     <p className="text-xs font-bold text-brand-green uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="h-3 w-3" /> The LINE Activado
                     </p>
                  </div>
                  <Link href="/dashboard/candidates">
                    <Button variant="outline" className="rounded-2xl h-auto py-4 px-6 border-gray-100 font-bold uppercase tracking-widest text-[9px] hover:bg-gray-50">
                      Ver Candidatos <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
               </div>
            </div>
          </div>
        )) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center space-y-6">
             <Briefcase className="h-12 w-12 text-gray-200" />
             <div className="space-y-2">
                <p className="text-xl font-bold text-black italic">No tienes vacantes activas.</p>
                <p className="text-sm text-gray-400">Publica tu primera posición para empezar a recibir talento verificado.</p>
             </div>
             <Link href="/dashboard/vacancies/new">
                <Button className="bg-black text-white rounded-xl uppercase tracking-widest text-[10px] font-bold">Empezar</Button>
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
