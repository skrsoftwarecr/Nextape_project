"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = () => {
    // MODO DE PRUEBAS: Si ambos campos están vacíos
    if (!email && !password) {
      sessionStorage.setItem('nextape_test_mode', 'true');
      router.push('/dashboard');
      return;
    }

    // Aquí iría la lógica normal de Firebase Auth si hay datos
    console.log("Intentando login con Firebase...");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <Card className="w-full max-w-[450px] border-none shadow-apple-lg rounded-[2.5rem] p-4 sm:p-8 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-center italic mb-4">
            {mode === "login" ? "Bienvenido." : "Únete a Nextape."}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-gray-400 ml-1">Email</Label>
              <Input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" 
                placeholder="name@example.com" 
                className="bg-gray-50 border-none h-14 rounded-2xl px-5 focus-visible:ring-1" 
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-gray-400 ml-1">Contraseña</Label>
              <Input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                placeholder="••••••••" 
                className="bg-gray-50 border-none h-14 rounded-2xl px-5 focus-visible:ring-1" 
              />
            </div>
          </div>

          <Button 
            onClick={handleAuth}
            className="w-full h-14 text-lg font-bold rounded-2xl bg-brand-blue hover:bg-brand-blue/90 shadow-apple transition-all"
          >
            {mode === "login" ? "Acceder" : "Crear Cuenta"}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-4 font-bold tracking-widest text-gray-300">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-gray-100 rounded-2xl h-14 font-bold hover:bg-gray-50 text-sm">
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
            <Button variant="outline" className="border-gray-100 rounded-2xl h-14 font-bold hover:bg-gray-50 text-sm">
              <Mail className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors"
            >
              {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
