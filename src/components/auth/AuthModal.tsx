"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";
import Link from "next/link";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [accountType, setAccountType] = useState<"developer" | "company">("developer");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-apple-lg rounded-[2.5rem] p-10 bg-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tight text-center mb-6">
            {mode === "login" ? "Bienvenido" : "Únete a Nextape"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {mode === "register" && (
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Tipo de cuenta</Label>
              <RadioGroup
                defaultValue="developer"
                onValueChange={(val) => setAccountType(val as any)}
                className="grid grid-cols-2 gap-3"
              >
                <div className={`flex items-center space-x-2 border rounded-2xl p-4 transition-all cursor-pointer ${accountType === "developer" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 hover:bg-gray-50"}`}>
                  <RadioGroupItem value="developer" id="developer" className="hidden" />
                  <Label htmlFor="developer" className="flex-1 cursor-pointer text-center font-bold text-sm tracking-tight">DEVELOPER</Label>
                </div>
                <div className={`flex items-center space-x-2 border rounded-2xl p-4 transition-all cursor-pointer ${accountType === "company" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 hover:bg-gray-50"}`}>
                  <RadioGroupItem value="company" id="company" className="hidden" />
                  <Label htmlFor="company" className="flex-1 cursor-pointer text-center font-bold text-sm tracking-tight">COMPANY</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-gray-400 ml-1">Email</Label>
              <Input type="email" placeholder="name@example.com" className="bg-gray-50 border-none h-14 rounded-2xl px-5 focus-visible:ring-1" />
            </div>
            {mode === "register" && (
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-gray-400 ml-1">Nombre</Label>
                <Input type="text" placeholder="John Doe" className="bg-gray-50 border-none h-14 rounded-2xl px-5 focus-visible:ring-1" />
              </div>
            )}
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-gray-400 ml-1">Contraseña</Label>
              <Input type="password" placeholder="••••••••" className="bg-gray-50 border-none h-14 rounded-2xl px-5 focus-visible:ring-1" />
            </div>
          </div>

          <Link href="/dashboard" onClick={onClose} className="block">
            <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-apple transition-all">
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </Link>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 font-bold tracking-widest text-gray-300">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-gray-100 rounded-2xl h-14 font-bold hover:bg-gray-50">
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
            <Button variant="outline" className="border-gray-100 rounded-2xl h-14 font-bold hover:bg-gray-50">
              <Mail className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm font-bold text-gray-400 hover:text-primary transition-colors"
            >
              {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}