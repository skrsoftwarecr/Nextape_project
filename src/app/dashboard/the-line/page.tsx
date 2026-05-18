
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, X, AlertTriangle, Monitor, ArrowRight, Award, Loader2 } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, Float, Center } from "@react-three/drei";
import * as THREE from "three";

type AssessmentState = "selector" | "immersive" | "results";
type NarrativeStep = "briefing" | "problem" | "analysis";

function LaptopModel() {
  const { scene } = useGLTF("/models/laptop.glb");
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function TheLinePage() {
  const [viewState, setViewState] = useState<AssessmentState>("selector");
  const [narrativeStep, setNarrativeStep] = useState<NarrativeStep>("briefing");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questions = [
    {
      briefing: "SISTEMA: Dashboard en tiempo real de alta frecuencia.",
      text: "Se detecta una congestión crítica en el hilo principal durante picos de volatilidad en el stream de datos de trading.",
      options: [
        "Direct DOM updates per event received via WebSockets.",
        "Buffer events in a Web Worker, batch updates using requestAnimationFrame.",
        "Throttle data at the API Gateway level to 10 events per second.",
        "Use React Context with a high-frequency polling interval of 50ms."
      ],
      correct: 1,
      context: "El desacoplamiento de la ingesta de datos y el renderizado es vital para el rendimiento."
    },
    {
       briefing: "SISTEMA: Arquitectura distribuida bajo partición de red.",
       text: "Según el teorema CAP, si tu prioridad absoluta es la Disponibilidad y la Tolerancia a Particiones (AP), ¿qué compromiso debes aceptar?",
       options: [
         "Latencia",
         "Consistencia Fuerte",
         "Rendimiento de Escritura",
         "Durabilidad"
       ],
       correct: 1,
       context: "En sistemas AP, la consistencia eventual es el precio de la disponibilidad continua."
    }
  ];

  const handleStart = () => {
    setIsConfirmOpen(false);
    setViewState("immersive");
    setNarrativeStep("briefing");
    localStorage.setItem("line_active", "true");
  };

  const handleExit = () => {
    setViewState("selector");
    localStorage.removeItem("line_active");
  };

  const nextStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (narrativeStep === "briefing") setNarrativeStep("problem");
      else if (narrativeStep === "problem") setNarrativeStep("analysis");
      setIsTransitioning(false);
    }, 400);
  };

  const handleAnswer = (index: number) => {
    setAnswers({ ...answers, [currentQuestion]: index });
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setNarrativeStep("briefing");
      } else {
        setViewState("results");
        localStorage.removeItem("line_active");
      }
      setIsTransitioning(false);
    }, 600);
  };

  if (viewState === "selector") {
    return (
      <div className="space-y-12 max-w-6xl mx-auto">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">The LINE.</h1>
          <p className="text-gray-500 font-medium">Evaluación de arquitectura y respuesta sistémica.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 ml-1">Dificultad Neural</label>
              <Select defaultValue="master">
                <SelectTrigger className="bg-gray-50 border-none h-16 rounded-2xl text-lg font-bold px-6 focus:ring-0">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-apple-lg">
                  <SelectItem value="apprentice" className="font-bold">APPRENTICE</SelectItem>
                  <SelectItem value="expert" className="font-bold">EXPERT</SelectItem>
                  <SelectItem value="master" className="font-bold">MASTER (TAPE-READY)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 ml-1">Especialidad</label>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "mc", name: "Arquitectura & Sistemas", desc: "Multiple Choice", active: true },
                  { id: "debug", name: "Live Debugging", desc: "Próximamente", active: false },
                ].map(spec => (
                  <button 
                    key={spec.id}
                    disabled={!spec.active}
                    className={`p-8 rounded-[2rem] border-2 text-left flex justify-between items-center transition-all ${spec.active ? "border-transparent bg-gray-50 hover:bg-brand-blue/5 hover:border-brand-blue/20 cursor-pointer" : "border-transparent opacity-40 cursor-not-allowed grayscale bg-gray-50/50"}`}
                  >
                    <div>
                      <span className="font-bold block text-lg">{spec.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{spec.desc}</span>
                    </div>
                    {spec.active && <ChevronRight className="h-6 w-6 text-brand-blue" />}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setIsConfirmOpen(true)}
              className="w-full h-20 bg-gray-950 hover:bg-black text-white rounded-[2rem] text-xl font-bold shadow-apple-lg transition-all active:scale-95"
            >
              Iniciar Neural Sync
            </Button>
          </div>

          <div className="bg-brand-blue p-12 rounded-[2.5rem] text-white space-y-10 flex flex-col justify-center relative overflow-hidden shadow-apple-lg">
            <div className="bg-white/10 p-4 rounded-2xl w-fit relative z-10">
              <Monitor className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-6 relative z-10">
              <h2 className="text-4xl font-bold tracking-tighter leading-[1.1]">Inmersión <br /> de Alto Contraste.</h2>
              <p className="text-xl opacity-90 font-medium leading-relaxed">
                Evaluamos tu precisión, velocidad y capacidad de tomar decisiones críticas bajo presión.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="border-none rounded-[3rem] p-12 bg-white max-w-xl shadow-apple-lg">
            <DialogHeader className="space-y-6">
              <div className="bg-brand-blue/10 p-6 rounded-[2rem] inline-flex w-fit mx-auto">
                <AlertTriangle className="h-12 w-12 text-brand-blue" />
              </div>
              <DialogTitle className="text-4xl font-bold tracking-tighter text-center leading-none">¿Estás preparado?</DialogTitle>
              <DialogDescription className="text-lg font-medium text-center text-gray-500 leading-relaxed px-4">
                Una vez dentro, el entorno no podrá pausarse. Tus resultados se firmarán digitalmente en tu perfil.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-4 mt-10">
              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} className="h-16 w-full rounded-2xl font-bold text-gray-400">
                Retirarse
              </Button>
              <Button onClick={handleStart} className="bg-gray-950 hover:bg-black text-white h-16 w-full rounded-2xl font-bold shadow-apple-lg">
                Entrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (viewState === "immersive") {
    const q = questions[currentQuestion];
    
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden select-none">
        {/* Header Cinematic */}
        <header className="p-8 flex justify-between items-center relative z-20">
          <button onClick={handleExit} className="flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-[10px] text-white/30 hover:text-white transition-opacity">
            <X className="h-4 w-4" /> Terminar Sesión
          </button>
          <div className="text-xs font-bold tracking-widest text-brand-blue animate-pulse">
            NEURAL_SYNC_ACTIVE
          </div>
          <div className="text-[10px] font-bold uppercase text-white/20 tracking-[0.3em]">
            Q0{currentQuestion + 1} / 0{questions.length}
          </div>
        </header>

        <div className="flex-grow flex flex-col md:flex-row items-center justify-center relative p-8 md:p-24">
          
          {/* Laptop 3D Centrada */}
          <div className="absolute inset-0 z-0 opacity-40">
            <Canvas shadows camera={{ position: [0, 0, 15], fov: 35 }}>
              <Suspense fallback={null}>
                <Stage environment="studio" intensity={0.5} contactShadow={{ opacity: 0.4 }}>
                  <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Center>
                      <LaptopModel />
                    </Center>
                  </Float>
                </Stage>
              </Suspense>
            </Canvas>
          </div>

          {/* Narrative Content */}
          <div className={`max-w-3xl w-full relative z-10 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
             
             {narrativeStep === "briefing" && (
                <div className="space-y-8 text-center" onClick={nextStep}>
                   <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">Contexto del Sistema</span>
                      <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter italic leading-tight">
                         {q.briefing}
                      </h2>
                   </div>
                   <p className="text-white/40 text-sm font-bold animate-pulse tracking-widest">TAP_TO_PROCEED</p>
                </div>
             )}

             {narrativeStep === "problem" && (
                <div className="space-y-8 text-center" onClick={nextStep}>
                   <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">Detección de Anomalía</span>
                      <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                         "{q.text}"
                      </h2>
                   </div>
                   <p className="text-white/40 text-sm font-bold animate-pulse tracking-widest uppercase">ANALYZING_VARIABLES...</p>
                </div>
             )}

             {narrativeStep === "analysis" && (
                <div className="space-y-12">
                   <div className="space-y-4 text-center md:text-left">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">Análisis de Resolución</span>
                      <h2 className="text-2xl md:text-4xl font-bold text-white leading-snug">
                         Selecciona el vector de solución óptimo para restaurar la integridad del sistema:
                      </h2>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          className="p-8 rounded-[1.5rem] border border-white/5 bg-white/5 text-left font-bold text-white/60 hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-white transition-all group relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between relative z-10">
                             <span className="text-sm md:text-base pr-4">{opt}</span>
                             <span className="text-[10px] font-mono text-white/10 group-hover:text-brand-blue">0{idx + 1}</span>
                          </div>
                        </button>
                      ))}
                   </div>
                </div>
             )}

          </div>
        </div>

        {/* Footer Progress */}
        <footer className="p-10 flex justify-center items-center relative z-20">
           <div className="flex gap-2">
              {questions.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i <= currentQuestion ? 'w-12 bg-brand-blue shadow-[0_0_15px_rgba(0,172,238,0.6)]' : 'w-6 bg-white/10'}`}></div>
              ))}
           </div>
        </footer>
      </div>
    );
  }

  if (viewState === "results") {
    const score = Math.round((Object.values(answers).filter((a, i) => a === questions[i].correct).length / questions.length) * 100);

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12 py-24">
        <header className="space-y-6">
          <div className="bg-brand-blue p-8 rounded-[2.5rem] shadow-apple-lg inline-flex">
            <Award className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">Sync <br /> Completado.</h1>
        </header>

        <div className="flex flex-col items-center">
          <div className="text-[12rem] md:text-[15rem] font-black leading-none italic text-brand-blue tracking-tighter">{score}</div>
          <div className="text-xl font-bold uppercase tracking-[0.3em] -mt-8 text-gray-400">Neural Integrity</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg pt-12">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-16 bg-gray-950 hover:bg-black text-white rounded-2xl font-bold uppercase tracking-widest shadow-apple-lg transition-all">
              Ver Perfil Actualizado
            </Button>
          </Link>
          <Button 
            onClick={() => setViewState("selector")} 
            className="w-full h-16 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl font-bold uppercase tracking-widest border border-gray-100 shadow-apple transition-all"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
