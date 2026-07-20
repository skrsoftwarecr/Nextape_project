"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Sparkles, Loader2, ArrowLeft, Target, Terminal } from "lucide-react";
import { auth, db } from "@/lib/firebase/client";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function NewVacancyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "Remote",
    type: "Full-time",
    level: "senior",
    skills: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      const skillsArray = formData.skills.split(",").map(s => s.trim().toLowerCase()).filter(s => s);
      
      const jobData = {
        title: formData.title,
        description: formData.description,
        salary: formData.salary,
        location: formData.location,
        type: formData.type,
        level: formData.level,
        requiredSkills: skillsArray,
        createdBy: auth.currentUser.uid,
        company: "Empresa NEXTAPE", 
        postedAt: Timestamp.now(),
        applicantsCount: 0
      };

      // Guardamos la vacante
      const docRef = await addDoc(collection(db, "jobs"), jobData);
      
      toast({ 
        title: "Vacante guardada", 
        description: "Iniciando diseño de simulación por IA..." 
      });

      // Generación de la prueba EN SERVIDOR: guarda las preguntas públicas (sin la respuesta
      // correcta) en la vacante y la clave en una colección protegida. Ver /api/jobs/assessment.
      await apiPost("/api/jobs/assessment", { jobId: docRef.id });

      toast({ 
        title: "¡Éxito!", 
        description: "La vacante y su prueba técnica están online." 
      });
      
      router.push("/dashboard/vacancies");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "No se pudo crear la vacante.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0 bg-white shadow-apple border border-gray-100">
           <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-black italic">Publicar Vacante.</h1>
           <p className="text-gray-400 font-medium text-sm uppercase tracking-widest font-bold mt-1">Configuración técnica de élite</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 space-y-8">
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Título de la Posición</Label>
                 <Input 
                   required
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="Ej: Senior React Architect" 
                   className="h-14 bg-gray-50 border-none rounded-2xl px-6 text-lg font-bold"
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Descripción del Rol</Label>
                 <Textarea 
                   required
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="Describe las responsabilidades principales..." 
                   className="min-h-[200px] bg-gray-50 border-none rounded-2xl p-6 text-sm font-medium leading-relaxed"
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Salario Estimado</Label>
                    <Input 
                      value={formData.salary}
                      onChange={e => setFormData({...formData, salary: e.target.value})}
                      placeholder="Ej: $80k - $120k" 
                      className="h-12 bg-gray-50 border-none rounded-xl"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Ubicación</Label>
                    <Input 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="Remote / City" 
                      className="h-12 bg-gray-50 border-none rounded-xl"
                    />
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-950 p-10 rounded-[2.5rem] text-white space-y-8 shadow-apple-lg relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div className="w-12 h-12 bg-brand-blue/20 rounded-2xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-brand-blue" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-bold italic">Stack de Precisión.</h4>
                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">La IA usará estos datos para generar los desafíos técnicos en "The LINE".</p>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Dificultad de la Prueba</Label>
                       <Select value={formData.level} onValueChange={v => setFormData({...formData, level: v})}>
                          <SelectTrigger className="bg-white/5 border-none h-12 rounded-xl text-white">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-apple-lg">
                             <SelectItem value="junior">Junior</SelectItem>
                             <SelectItem value="mid">Mid-Level</SelectItem>
                             <SelectItem value="senior">Senior</SelectItem>
                             <SelectItem value="master">Master / Architect</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Skills (Separadas por coma)</Label>
                       <Input 
                         required
                         value={formData.skills}
                         onChange={e => setFormData({...formData, skills: e.target.value})}
                         placeholder="react, nextjs, docker..." 
                         className="bg-white/5 border-none h-12 rounded-xl text-white px-4"
                       />
                    </div>
                 </div>

                 <Button 
                   type="submit"
                   disabled={loading}
                   className="w-full h-14 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-apple-lg active:scale-95 transition-all"
                 >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" /> DISEÑANDO...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> LANZAR VACANTE
                      </span>
                    )}
                 </Button>
              </div>
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl" />
           </div>

           <div className="p-8 bg-white rounded-[2rem] shadow-apple border border-gray-50 flex items-center gap-4">
              <Terminal className="h-5 w-5 text-brand-blue" />
              <p className="text-[10px] font-bold text-gray-400 leading-tight">
                 NOTIFICACIÓN: Se activará un entorno neural único para esta vacante tras la publicación.
              </p>
           </div>
        </div>
      </form>
    </div>
  );
}
