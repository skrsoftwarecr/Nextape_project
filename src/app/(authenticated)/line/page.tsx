
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, X, AlertTriangle, Monitor, Award, Terminal } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Text, Float, Stage } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

function LaptopModel({ feedback }: { feedback: "none" | "correct" | "incorrect" }) {
  const { scene } = useGLTF("/models/laptop.glb");
  const groupRef = useRef<THREE.Group>(null);
  const feedbackLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (feedbackLightRef.current) {
      feedbackLightRef.current.intensity = feedback !== "none" ? 10 : 0;
    }
  });

  const feedbackColor = feedback === "correct" ? "#00A44E" : "#E52521";

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <pointLight ref={feedbackLightRef} position={[0, 2, 1]} color={feedbackColor} distance={5} />
      {feedback !== "none" && (
        <Float speed={5} rotationIntensity={0.1} floatIntensity={0.5}>
          <Text
            position={[0, 3.5, 0.5]}
            fontSize={0.3}
            color={feedbackColor}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/dmmono/v14/u-4n0qWbwpswbXTV7CH_XW_m.woff"
          >
            {feedback === "correct" ? "INTEGRIDAD_RESTAURADA" : "FALLO_SISTEMA"}
          </Text>
        </Float>
      )}
    </group>
  );
}

export default function TheLinePage() {
  const [viewState, setViewState] = useState<"selector" | "immersive" | "results">("selector");
  const [narrativeStep, setNarrativeStep] = useState<"briefing" | "problem" | "analysis">("briefing");
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const questions = [
    {
      briefing: "SISTEMA: Dashboard en tiempo real de alta frecuencia.",
      text: "Se detecta una congestión crítica en el hilo principal durante picos de volatilidad en el stream de datos de trading.",
      options: [
        "Actualizaciones directas del DOM por evento.",
        "Buffer de eventos en Worker + requestAnimationFrame.",
        "Throttle de datos en API a 10 eventos/seg.",
        "Intervalo de sondeo de alta frecuencia de 50ms."
      ],
      correct: 1,
    },
    {
       briefing: "SISTEMA: Arquitectura distribuida bajo partición.",
       text: "Según el teorema CAP, si priorizas Disponibilidad y Partición (AP), ¿qué compromiso aceptas?",
       options: [
         "Latencia de red",
         "Consistencia Fuerte",
         "Rendimiento de Escritura",
         "Durabilidad de datos"
       ],
       correct: 1,
    }
  ];

  if (!isMounted) return null;

  if (viewState === "selector") {
    return (
      <div className="space-y-6 md:space-y-12 max-w-6xl mx-auto px-4 md:px-0">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">The LINE.</h1>
          <p className="text-sm md:text-base text-gray-500 font-medium">Evaluación de arquitectura y respuesta sistémica.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-apple border border-gray-50">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 ml-1">Dificultad Neural</label>
              <Select defaultValue="master">
                <SelectTrigger className="bg-gray-50 border-none h-14 md:h-16 rounded-2xl text-base md:text-lg font-bold px-6 focus:ring-0">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-apple-lg">
                  <SelectItem value="master" className="font-bold">MAESTRO (TAPE-READY)</SelectItem>
                  <SelectItem value="expert" className="font-bold">EXPERTO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => setIsConfirmOpen(true)}
              className="w-full h-16 md:h-20 bg-gray-950 hover:bg-black text-white rounded-[1.5rem] md:rounded-[2rem] text-lg md:text-xl font-bold shadow-apple-lg"
            >
              Iniciar Sincronización
            </Button>
          </div>
          <div className="bg-brand-blue p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] text-white flex flex-col justify-center shadow-apple-lg">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight">Sincronización de Alto Impacto.</h2>
          </div>
        </div>

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="border-none rounded-[2rem] p-10 bg-white max-w-xl">
             <DialogHeader className="space-y-4">
                <DialogTitle className="text-3xl font-bold text-center">¿Estás preparado?</DialogTitle>
                <DialogDescription className="text-center text-lg">Tus resultados se firmarán en tu identidad Nextape.</DialogDescription>
             </DialogHeader>
             <DialogFooter className="gap-4 mt-8">
                <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} className="h-14 w-full">Regresar</Button>
                <Button onClick={() => setViewState("immersive")} className="bg-black text-white h-14 w-full">Iniciar Sync</Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-12">
      <h2 className="text-4xl font-bold italic tracking-tighter">THE_LINE_ENV_01</h2>
      <Button onClick={() => setViewState("selector")} variant="ghost" className="mt-8 text-white/50 hover:text-white">SALIR_SESION</Button>
    </div>
  );
}
