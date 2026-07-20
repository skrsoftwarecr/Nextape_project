"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { AuthModal } from "@/components/auth/AuthModal";

export default function AuthPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      } else {
        setIsReady(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
           <div className="w-12 h-12 bg-brand-blue rounded-2xl mx-auto flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
           </div>
           <h1 className="text-3xl font-black italic tracking-tighter">Identidad Nextape.</h1>
           <p className="text-gray-400 font-medium leading-relaxed">
             Para continuar, inicia sesión o crea una cuenta para validar tu DNA técnico.
           </p>
        </div>
        <div className="bg-white p-1 rounded-[2.5rem] shadow-apple-lg border border-gray-100/50">
           <AuthModal isOpen={true} onClose={() => {}} />
        </div>
      </div>
    </div>
  );
}