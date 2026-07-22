
"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, Zap, Loader2, Sparkles, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase/client";
import { getDocById, setDocById } from "@/lib/firebase/firestore";
import { generateRoadmap } from "@/ai/flows/generate-roadmap-flow";
import { SkillsService } from "@/services/skills.service";
import { onAuthStateChanged, User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export default function RoadmapPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const loadRoadmap = useCallback(async (uid: string) => {
    try {
      const data = await getDocById<any>("user_roadmaps", uid);
      if (data && data.steps) {
        setSteps(data.steps);
      }
    } catch (error) {
      console.error("Error loading roadmap:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadRoadmap(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadRoadmap]);

  const handleGenerate = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      const skillData = await SkillsService.getSkills(user.uid);
      const currentSkills = Object.entries(skillData?.scores || {}).map(([name, score]) => ({
        name,
        score: score as number
      }));

      const gaps = currentSkills.filter(s => s.score < 70).map(s => s.name);
      
      const result = await generateRoadmap({
        currentSkills,
        targetRole: "Senior Software Engineer",
        gaps: gaps.length > 0 ? gaps : ["Sistemas Distribuidos", "Arquitecturas en la Nube"]
      });

      const roadmapData = {
        steps: result.steps,
        summary: result.summary,
        updatedAt: Timestamp.now()
      };

      await setDocById("user_roadmaps", user.uid, roadmapData);
      setSteps(result.steps);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    } finally {
      setGenerating(false);
    }
  };

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
          <h1 className="text-4xl font-bold tracking-tight text-black italic">Roadmap Personal.</h1>
          <p className="text-gray-500 font-medium">Tu ruta crítica hacia la maestría técnica generada por IA.</p>
        </div>
        <Button 
          disabled={generating || !user}
          onClick={handleGenerate}
          className="h-14 px-8 bg-brand-blue rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-apple hover:scale-105 transition-all text-white"
        >
          {generating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {steps.length > 0 ? "Actualizar Roadmap" : "Generar Mi Roadmap"}
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-8">
         {steps.length > 0 ? steps.map((step, idx) => (
           <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-apple flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-apple-lg transition-all">
              <div className="flex gap-8 items-center flex-1">
                 <div className="text-5xl font-black text-gray-100 italic group-hover:text-brand-blue/20 transition-colors">0{idx + 1}</div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-black italic">{step.title}</h3>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed">{step.description}</p>
                 </div>
              </div>
              <div className="flex items-center gap-10">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Prioridad</span>
                    <div className="flex items-center gap-2 text-black font-bold">
                       <Zap className={cn("h-4 w-4", step.priority === 'critical' ? 'text-brand-red' : 'text-brand-blue')} />
                       {step.priority.toUpperCase()}
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Esfuerzo</span>
                    <div className="flex items-center gap-2 text-black font-bold">
                       <Clock className="h-4 w-4 text-gray-400" />
                       {step.estimatedHours}h
                    </div>
                 </div>
              </div>
           </div>
         )) : (
           <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center space-y-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                 <Map className="h-8 w-8 text-gray-300" />
              </div>
              <div className="space-y-2">
                 <p className="text-xl font-bold text-black italic">No hay roadmap activo.</p>
                 <p className="text-sm text-gray-400 max-w-xs mx-auto">Sincroniza tu DNA técnico para generar una ruta de aprendizaje personalizada por IA.</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
