"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Github, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithEmail,
  createUserWithEmail
} from "@/lib/firebase/auth";
import { UserService } from "@/features/auth/services/users.service";
import { Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/useToast";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"developer" | "recruiter">("developer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const { user } = await createUserWithEmail(email, password);
        await UserService.saveUser(user.uid, {
          uid: user.uid,
          displayName: name || user.displayName || "User",
          email: user.email!,
          role: role,
          createdAt: Timestamp.now() as any
        });
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error de autenticación';
      toast({ description: msg })
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      const result = provider === 'google' ? await signInWithGoogle() : await signInWithGithub();
      const user = result.user;

      // Intentar obtener usuario existente
      const existing = await UserService.getUser(user.uid);
      if (!existing) {
        await UserService.saveUser(user.uid, {
          uid: user.uid,
          displayName: user.displayName || "User",
          email: user.email!,
          photoURL: user.photoURL || undefined,
          role: role, // Usamos el rol seleccionado en el UI
          createdAt: Timestamp.now() as any
        });
      }
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error de autenticación';
      toast({ description: msg })
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-gray-400 ml-1">¿Qué buscas?</Label>
                  <RadioGroup defaultValue="developer" onValueChange={(v) => setRole(v as any)} className="grid grid-cols-2 gap-4">
                    <div className={cn("flex items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all", role === 'developer' ? "border-brand-blue bg-brand-blue/5 shadow-sm" : "border-gray-100")}>
                      <RadioGroupItem value="developer" id="dev" className="sr-only" />
                      <Label htmlFor="dev" className="cursor-pointer font-bold text-xs uppercase tracking-tight">Soy Developer</Label>
                    </div>
                    <div className={cn("flex items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all", role === 'recruiter' ? "border-brand-blue bg-brand-blue/5 shadow-sm" : "border-gray-100")}>
                      <RadioGroupItem value="recruiter" id="rec" className="sr-only" />
                      <Label htmlFor="rec" className="cursor-pointer font-bold text-xs uppercase tracking-tight">Soy Empresa</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-[10px] uppercase tracking-widest text-gray-400 ml-1">Nombre Completo</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="bg-gray-50 border-none h-14 rounded-2xl px-5 focus-visible:ring-1"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-gray-400 ml-1">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
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
                required
                placeholder="••••••••"
                className="bg-gray-50 border-none h-14 rounded-2xl px-5 focus-visible:ring-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-brand-blue hover:bg-brand-blue/90 shadow-apple transition-all mt-4"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (mode === "login" ? "Acceder" : "Crear Cuenta")}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-4 font-bold tracking-widest text-gray-300">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleSocialAuth('github')} variant="outline" className="border-gray-100 rounded-2xl h-14 font-bold hover:bg-gray-50 text-sm">
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
            <Button onClick={() => handleSocialAuth('google')} variant="outline" className="border-gray-100 rounded-2xl h-14 font-bold hover:bg-gray-50 text-sm">
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
