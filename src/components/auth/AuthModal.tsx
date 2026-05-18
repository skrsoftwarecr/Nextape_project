
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
      <DialogContent className="sm:max-w-[450px] border-4 border-black p-8 bg-background">
        <DialogHeader>
          <DialogTitle className="text-4xl font-headline tracking-tighter uppercase mb-4">
            {mode === "login" ? "Welcome Back" : "Join the Tape"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {mode === "register" && (
            <div className="space-y-3">
              <Label className="font-bold text-xs uppercase tracking-widest">Account Type</Label>
              <RadioGroup
                defaultValue="developer"
                onValueChange={(val) => setAccountType(val as any)}
                className="grid grid-cols-2 gap-4"
              >
                <div className={`flex items-center space-x-2 border-2 p-3 ${accountType === "developer" ? "border-primary bg-primary/5" : "border-black"}`}>
                  <RadioGroupItem value="developer" id="developer" className="hidden" />
                  <Label htmlFor="developer" className="flex-1 cursor-pointer text-center font-bold">DEVELOPER</Label>
                </div>
                <div className={`flex items-center space-x-2 border-2 p-3 ${accountType === "company" ? "border-primary bg-primary/5" : "border-black"}`}>
                  <RadioGroupItem value="company" id="company" className="hidden" />
                  <Label htmlFor="company" className="flex-1 cursor-pointer text-center font-bold">COMPANY</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest">Email Address</Label>
              <Input type="email" placeholder="name@example.com" className="border-2 border-black h-12" />
            </div>
            {mode === "register" && (
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest">Full Name</Label>
                <Input type="text" placeholder="John Doe" className="border-2 border-black h-12" />
              </div>
            )}
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest">Password</Label>
              <Input type="password" placeholder="••••••••" className="border-2 border-black h-12" />
            </div>
          </div>

          <Link href="/dashboard" onClick={onClose}>
            <Button className="w-full h-14 text-lg font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none border-b-4 border-r-4 border-black active:translate-y-1 active:border-b-0 active:border-r-0">
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-black" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 font-bold tracking-tighter">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-2 border-black rounded-none h-12 font-bold uppercase tracking-widest">
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
            <Button variant="outline" className="border-2 border-black rounded-none h-12 font-bold uppercase tracking-widest">
              <Mail className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm font-bold underline uppercase tracking-widest hover:text-primary transition-colors"
            >
              {mode === "login" ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
