
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, X, AlertTriangle, Monitor, Award, Terminal } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, Text, Stage } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type AssessmentState = "selector" | "immersive" | "results";
type NarrativeStep = "briefing" | "problem" | "analysis";
type FeedbackStatus = "none" | "correct" | "incorrect";

function LaptopModel({ 
  feedback 
}: { 
  feedback: FeedbackStatus 
}) {
  const { scene } = useGLTF("/models/laptop.glb");
  const groupRef = useRef<THREE.Group>(null);
  const feedbackLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
    if (feedbackLightRef.current) {
      feedbackLightRef.current.intensity = feedback !== "none" ? 10 : 0;
    }
  });

  const feedbackColor = feedback === "correct" ? "#00A44E" : "#E52521";

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <pointLight 
        ref={feedbackLightRef} 
        position={[0, 2, 1]} 
        color={feedbackColor} 
        distance={5}
      />
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
  const [viewState, setViewState] = useState<AssessmentState>("selector");
  const [narrativeStep, setNarrativeStep] = useState<NarrativeStep>("briefing");
  const [feedback, setFeedback] = useState<FeedbackStatus>("none");
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

  const handleStart = () => {
    setIsConfirmOpen(false);
    setViewState("immersive");
    setNarrativeStep("briefing");
    setFeedback("none");
  };

  const handleExit = () => {
    setViewState("selector");
    setCurrentQuestion(0);
    setAnswers({});
  };

  const nextStep = () => {
    if (isTransitioning || feedback !== "none") return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (narrativeStep === "briefing") setNarrativeStep("problem");
      else if (narrativeStep === "problem") setNarrativeStep("analysis");
      setIsTransitioning(false);
    }, 400);
  };

  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentQuestion].correct;
    setFeedback(isCorrect ? "correct" : "incorrect");
    setAnswers({ ...answers, [currentQuestion]: index });
    
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setNarrativeStep("briefing");
          setFeedback("none");
        } else {
          setViewState("results");
        }
        setIsTransitioning(false);
      }, 1000);
    }, 2000);
  };

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
                  <SelectItem value="apprentice" className="font-bold">APRENDIZ</SelectItem>
                  <SelectItem value="expert" className="font-bold">EXPERTO</SelectItem>
                  <SelectItem value="master" className="font-bold">MAESTRO (TAPE-READY)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 ml-1">Modalidad de Evaluación</label>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "mc", name: "Arquitectura & Sistemas", desc: "Desafío de Opción Múltiple", active: true },
                  { id: "debug", name: "Live Debugging", desc: "Próximamente", active: false },
                ].map(spec => (
                  <button 
                    key={spec.id}
                    disabled={!spec.active}
                    className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 text-left flex justify-between items-center transition-all ${spec.active ? "border-transparent bg-gray-50 hover:bg-brand-blue/5 hover:border-brand-blue/20 cursor-pointer" : "border-transparent opacity-40 cursor-not-allowed grayscale bg-gray-50/50"}`}
                  >
                    <div>
                      <span className="font-bold block text-base md:text-lg">{spec.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{spec.desc}</span>
                    </div>
                    {spec.active && <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-brand-blue" />}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setIsConfirmOpen(true)}
              className="w-full h-16 md:h-20 bg-gray-950 hover:bg-black text-white rounded-[1.5rem] md:rounded-[2rem] text-lg md:text-xl font-bold shadow-apple-lg transition-all active:scale-95"
            >
              Iniciar Sincronización
            </Button>
          </div>

          <div className="bg-brand-blue p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] text-white space-y-6 md:space-y-10 flex flex-col justify-center relative overflow-hidden shadow-apple-lg">
            <div className="bg-white/10 p-4 rounded-2xl w-fit relative z-10">
              <Monitor className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <div className="space-y-4 md:space-y-6 relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1]">Sincronización <br /> de Alto Impacto.</h2>
              <p className="text-lg md:text-xl opacity-90 font-medium leading-relaxed">
                El entorno de "The LINE" evalúa tu precisión arquitectónica bajo escenarios de fallo en tiempo real.
              </p>
            </div>
          </div>
        </div>

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="border-none rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 bg-white max-w-xl shadow-apple-lg">
            <DialogHeader className="space-y-6">
              <div className="bg-brand-blue/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] inline-flex w-fit mx-auto">
                <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-brand-blue" />
              </div>
              <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tighter text-center leading-none">¿Estás preparado?</DialogTitle>
              <DialogDescription className="text-base md:text-lg font-medium text-center text-gray-500 leading-relaxed px-4">
                Tus resultados se firmarán digitalmente en tu identidad Nextape.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-4 mt-8 md:mt-10">
              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} className="h-14 md:h-16 w-full rounded-2xl font-bold text-gray-400">Regresar</Button>
              <Button onClick={handleStart} className="bg-gray-950 hover:bg-black text-white h-14 md:h-16 w-full rounded-2xl font-bold">Iniciar Sync</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (viewState === "immersive") {
    const q = questions[currentQuestion];
    const isAnalysis = narrativeStep === "analysis";
    
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden select-none">
        <header className="p-4 md:p-8 flex justify-between items-center relative z-50">
          <button onClick={handleExit} className="flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] text-white/30 hover:text-white">
            <X className="h-3 w-3 md:h-4 md:w-4" /> FINALIZAR_SESION
          </button>
          <div className="text-[10px] font-bold tracking-widest text-brand-blue animate-pulse hidden sm:block">NEURAL_SYNC_ACTIVE</div>
          <div className="text-[9px] md:text-[10px] font-bold uppercase text-white/20 tracking-[0.3em]">
            Q0{currentQuestion + 1} / 0{questions.length}
          </div>
        </header>

        <div className="flex-grow relative flex flex-col items-center justify-center px-4 md:px-12">
          <div className={cn(
            "absolute inset-0 z-10 pointer-events-none transition-all duration-700 bg-brand-blue/0",
            isTransitioning && "bg-brand-blue/20 backdrop-blur-[100px] z-50"
          )} />

          <div className="max-w-7xl w-full h-full relative z-20 flex flex-col justify-center">
            {!isAnalysis ? (
              <div className={cn(
                "flex flex-col h-full justify-center items-center text-center transition-all duration-700 space-y-8 md:space-y-12",
                isTransitioning && "opacity-0 scale-95 blur-xl"
              )}>
                <div className="absolute inset-0 z-0 opacity-30 md:opacity-40 pointer-events-none">
                  <Canvas camera={{ position: [0, 0, 15], fov: 35 }}>
                    <Suspense fallback={null}>
                      <Stage environment="studio" intensity={0.5} contactShadow={{ opacity: 0.2 }}>
                        <LaptopModel feedback={feedback} />
                      </Stage>
                    </Suspense>
                  </Canvas>
                </div>

                <div className="relative z-10 space-y-6 md:space-y-12 cursor-pointer group w-full max-w-4xl" onClick={nextStep}>
                  {narrativeStep === "briefing" ? (
                    <div className="space-y-4 md:space-y-6 px-4">
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-brand-blue">Contexto del Sistema</span>
                      <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter italic leading-tight">
                        {q.briefing}
                      </h2>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6 px-4">
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-brand-blue">Detección de Anomalía</span>
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                        "{q.text}"
                      </h2>
                    </div>
                  )}
                  <p className="text-white/20 text-[9px] font-bold tracking-[0.4em] uppercase group-hover:text-white/50 transition-colors pt-4">Siguiente_fase (Click)</p>
                </div>
              </div>
            ) : (
              <div className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 h-full items-center transition-all duration-700",
                isTransitioning && "opacity-0 blur-xl"
              )}>
                {/* Left Column: Model */}
                <div className="flex flex-col h-[30vh] md:h-full justify-center space-y-4 md:space-y-8 order-1">
                  <div className="space-y-2 md:space-y-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-blue rounded-full animate-ping" />
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-brand-blue">ANALYSIS_MODE_ACTIVE</span>
                    </div>
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white tracking-tighter leading-tight">
                      Evaluando desempeño sistémico.
                    </h2>
                  </div>
                  
                  <div className="flex-grow min-h-[150px] md:min-h-[400px] relative">
                    <Canvas camera={{ position: [0, 0, 15], fov: 35 }}>
                      <Suspense fallback={null}>
                        <Stage environment="studio" intensity={0.5} contactShadow={{ opacity: 0.2 }}>
                          <LaptopModel feedback={feedback} />
                        </Stage>
                      </Suspense>
                    </Canvas>
                  </div>
                </div>

                {/* Right Column: Content */}
                <div className="flex flex-col justify-center space-y-6 md:space-y-10 order-2 overflow-y-auto max-h-[50vh] md:max-h-full pb-8 md:pb-0">
                  <div className="p-6 md:p-10 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 backdrop-blur-3xl space-y-3 md:space-y-4 shadow-2xl">
                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-brand-blue">Vector del Incidente</span>
                    <p className="text-white text-base md:text-xl font-medium leading-relaxed italic tracking-tight">"{q.text}"</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {q.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        disabled={feedback !== "none"}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          "p-5 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border text-left font-bold transition-all relative overflow-hidden h-full flex items-center justify-between group",
                          feedback === "none" 
                            ? "bg-white/5 border-white/10 text-white/50 hover:border-brand-blue hover:bg-brand-blue/5 hover:text-white"
                            : idx === q.correct 
                              ? "bg-brand-green/20 border-brand-green/50 text-brand-green"
                              : answers[currentQuestion] === idx 
                                ? "bg-brand-red/20 border-brand-red/50 text-brand-red"
                                : "bg-white/5 border-white/5 text-white/10"
                        )}
                      >
                        <span className="text-xs md:text-sm tracking-tight leading-snug">{opt}</span>
                        <ChevronRight className={cn(
                          "h-4 w-4 shrink-0 transition-all hidden sm:block",
                          feedback === "none" ? "opacity-0 group-hover:opacity-100 group-hover:translate-x-1" : "opacity-0"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="p-6 md:p-10 flex justify-center items-center relative z-50">
           <div className="flex gap-2 md:gap-3">
              {questions.map((_, i) => (
                <div key={i} className={cn(
                  "h-1 rounded-full transition-all duration-700",
                  i === currentQuestion ? 'w-10 md:w-12 bg-brand-blue' : 
                  i < currentQuestion ? 'w-4 md:w-6 bg-brand-green' : 'w-4 md:w-6 bg-white/10'
                )}></div>
              ))}
           </div>
        </footer>
      </div>
    );
  }

  if (viewState === "results") {
    const score = Math.round((Object.values(answers).filter((a, i) => a === questions[i].correct).length / questions.length) * 100);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-8 md:space-y-12 p-6 animate-in fade-in zoom-in duration-700 bg-black text-white">
        <div className="bg-brand-blue/10 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] inline-flex mb-4">
           <Award className="h-12 w-12 md:h-16 md:w-16 text-brand-blue" />
        </div>
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-brand-blue leading-none">{score}%</h1>
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-400">Integridad Neural Certificada</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-6 md:pt-8">
           <Link href="/dashboard" className="w-full">
             <Button className="w-full h-14 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs">Actualizar Perfil</Button>
           </Link>
           <Button onClick={handleExit} variant="outline" className="h-14 w-full rounded-2xl border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">Reintentar</Button>
        </div>
      </div>
    );
  }

  return null;
}
