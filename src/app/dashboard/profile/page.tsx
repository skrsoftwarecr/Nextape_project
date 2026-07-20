"use client";

import { useEffect, useState } from "react";
import { Fingerprint, Zap, Target, Activity, Loader2, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/firebase/client";
import { SkillsService } from "@/services/skills.service";
import { UserService } from "@/services/users.service";
import { UserProfile } from "@/types/user.types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState("N/A");

  useEffect(() => {
    const loadProfileData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const [userData, skillData] = await Promise.all([
          UserService.getUser(user.uid),
          SkillsService.getSkills(user.uid)
        ]);

        setProfile(userData);
        
        if (skillData?.scores) {
          const formatted = Object.entries(skillData.scores).map(([name, val]) => ({
            name: name.toUpperCase(),
            value: val as number
          }));
          setSkills(formatted);

          const avg = formatted.reduce((acc, curr) => acc + curr.value, 0) / formatted.length;
          if (avg > 90) setGrade("S");
          else if (avg > 80) setGrade("A");
          else if (avg > 60) setGrade("B");
          else setGrade("C");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center border border-gray-200">
               <UserIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-black italic leading-none">{profile?.displayName || "Candidato"}</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">{profile?.role} verified identity</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 text-center min-w-[240px]">
          <span className="text-7xl font-black tracking-tighter text-brand-blue leading-none italic">{grade}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] block mt-4 text-gray-300">Technical Rank</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-12 rounded-[3rem] shadow-apple border border-gray-50 space-y-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-brand-blue/10 rounded-2xl">
                 <Zap className="h-7 w-7 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-bold text-black italic">Technical DNA</h2>
            </div>
            
            <div className="space-y-10">
              {skills.length > 0 ? skills.map(skill => (
                <div key={skill.name} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="font-bold text-sm uppercase tracking-widest text-black">{skill.name}</p>
                    <span className="font-black text-2xl text-brand-blue italic">{skill.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-brand-blue rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-gray-400 italic font-medium">
                  DNA técnico no sincronizado. Completa una prueba en "The LINE" para activar tu perfil.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-950 p-12 rounded-[3rem] text-white space-y-10 shadow-apple-lg relative overflow-hidden group">
             <Fingerprint className="h-12 w-12 text-brand-blue relative z-10" />
             <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-bold tracking-tight italic">Estado del CORE.</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Tu identidad técnica está activa y es consultable por empresas registradas. Los reclutadores ven tu DNA en tiempo real.
                </p>
             </div>
             <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
           </div>
        </div>
      </div>
    </div>
  );
}
