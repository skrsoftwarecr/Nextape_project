
"use client";

import { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, X, AlertTriangle, Monitor, Award, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, Float, Center, Text } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type AssessmentState = "selector" | "immersive" | "results";
type NarrativeStep = "briefing" | "problem" | "analysis";
type FeedbackStatus = "none" | "correct" | "incorrect";

function LaptopModel({ 
  isAnalysisMode, 
  feedback 
}: { 
  isAnalysisMode: boolean; 
  feedback: FeedbackStatus 
}) {
  const { scene } = useGLTF("/models/laptop.glb");
  const groupRef = useRef<THREE.Group>(null);
  const feedbackLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Posicionamiento interpolado suave
      // En análisis se mueve a la izquierda (-3), en narrativa se queda al centro (0)
      const targetX = isAnalysisMode ? -3 : 0;
      const targetScale = isAnalysisMode ? 0.7 : 1.1;
      const targetZ = isAnalysisMode ? 0 : -2; // Se aleja un poco cuando es fondo de narrativa
      
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);
      
      const currentScale = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
      groupRef.current.scale.setScalar(newScale);
      
      // Rotación constante sutil
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }

    if (feedbackLightRef.current) {
      // La intensidad de la luz de feedback solo sube cuando hay respuesta
      feedbackLightRef.current.intensity = feedback !== "none" ? 15 : 0;
    }
  });

  const feedbackColor = feedback === "correct" ? "#00A44E" : "#E52521";

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      
      {/* Luz puntual que emana desde la pantalla al responder */}
      <pointLight 
        ref={feedbackLightRef} 
        position={[0, 1, 1]} 
        color={feedbackColor} 
        distance={8}
        decay={2}
      />

      {/* Texto holográfico flotante sobre la laptop */}
      {feedback !== "none" && (
        <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.35}
            color={feedbackColor}
            font="/fonts/Geist-Bold.ttf"
            anchorX="center"
            anchorY="middle"
          >
            {feedback === "correct" ? "INTEGRITY_RESTORED" : "SYSTEM_FAILURE"}
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
    
    // Pausa para que el usuario vea el feedback en la laptop
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
      }, 600);
    }, 2000);
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
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 ml-1">Modalidad de Evaluación</label>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "mc", name: "Arquitectura & Sistemas", desc: "Desafío de Opción Múltiple", active: true },
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
              <h2 className="text-4xl font-bold tracking-tighter leading-[1.1]">Sincronización <br /> de Alto Impacto.</h2>
              <p className="text-xl opacity-90 font-medium leading-relaxed">
                El entorno de "The LINE" evalúa tu precisión arquitectónica bajo escenarios de fallo en tiempo real.
              </p>
            </div>
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
                Tus resultados se firmarán digitalmente en tu identidad Nextape.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-4 mt-10">
              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} className="h-16 w-full rounded-2xl font-bold text-gray-400">Regresar</Button>
              <Button onClick={handleStart} className="bg-gray-950 hover:bg-black text-white h-16 w-full rounded-2xl font-bold">Iniciar Sync</Button>
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
        {/* Header Cinemático */}
        <header className="p-8 flex justify-between items-center relative z-50">
          <button onClick={handleExit} className="flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-[10px] text-white/30 hover:text-white">
            <X className="h-4 w-4" /> Finalizar Sesión
          </button>
          <div className="text-xs font-bold tracking-widest text-brand-blue animate-pulse">NEURAL_SYNC_ACTIVE</div>
          <div className="text-[10px] font-bold uppercase text-white/20 tracking-[0.3em]">
            Q0{currentQuestion + 1} / 0{questions.length}
          </div>
        </header>

        <div className="flex-grow relative flex flex-col items-center justify-center p-6 md:p-24 overflow-hidden">
          
          {/* Capa 3D: Ocupa el fondo, se posiciona según el estado */}
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
              <Suspense fallback={null}>
                {/* Stage maneja la iluminación base. La laptopModel maneja su posición local */}
                <Stage environment="studio" intensity={0.6} contactShadow={{ opacity: 0.2 }}>
                  <LaptopModel 
                    isAnalysisMode={isAnalysis} 
                    feedback={feedback} 
                  />
                </Stage>
              </Suspense>
            </Canvas>
            {/* Overlay sutil para "desvanecer" la laptop cuando es fondo */}
            {!isAnalysis && <div className="absolute inset-0 bg-black/40 pointer-events-none" />}
          </div>

          {/* Contenedor de Interfaz: Z-20 para estar sobre el Canvas */}
          <div className={cn(
            "max-w-7xl w-full relative z-20 transition-all duration-700 grid gap-12 h-full",
            isAnalysis ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}>
            
            {/* Columna Texto: Siempre presente */}
            <div className={cn(
              "flex flex-col justify-center transition-all duration-700",
              isAnalysis ? "items-start text-left" : "items-center text-center",
              isTransitioning && "opacity-0 translate-y-4 blur-sm"
            )}>
              {narrativeStep === "briefing" && (
                <div className="space-y-12 cursor-pointer w-full group" onClick={nextStep}>
                  <div className="space-y-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">Contexto del Sistema</span>
                    <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter italic leading-[1.1]">
                      {q.briefing}
                    </h2>
                  </div>
                  <p className="text-white/20 text-[9px] font-bold tracking-[0.4em] uppercase group-hover:text-white/50 transition-colors">Recibir_datos (Click)</p>
                </div>
              )}

              {narrativeStep === "problem" && (
                <div className="space-y-12 cursor-pointer w-full group" onClick={nextStep}>
                  <div className="space-y-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">Detección de Anomalía</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                      "{q.text}"
                    </h2>
                  </div>
                  <p className="text-white/20 text-[9px] font-bold tracking-[0.4em] uppercase group-hover:text-white/50 transition-colors">Analizar_vectores (Click)</p>
                </div>
              )}

              {isAnalysis && (
                <div className="space-y-8 max-w-lg">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">Procedimiento de Análisis</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                    Selecciona el vector de resolución óptimo:
                  </h2>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <p className="text-white/40 text-[11px] font-medium leading-relaxed italic">"{q.text}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Columna Opciones: Solo en fase de análisis */}
            {isAnalysis && (
              <div className={cn(
                "flex flex-col justify-center space-y-4 transition-all duration-700",
                isTransitioning ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
              )}>
                {q.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    disabled={feedback !== "none"}
                    onClick={() => handleAnswer(idx)}
                    className={cn(
                      "p-6 md:p-8 rounded-[1.5rem] border text-left font-bold transition-all relative overflow-hidden",
                      feedback === "none" 
                        ? "bg-white/5 border-white/10 text-white/50 hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-white"
                        : idx === q.correct 
                          ? "bg-brand-green/20 border-brand-green/50 text-brand-green"
                          : answers[currentQuestion] === idx 
                            ? "bg-brand-red/20 border-brand-red/50 text-brand-red"
                            : "bg-white/5 border-white/5 text-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                       <span className="text-sm md:text-base">{opt}</span>
                       <span className="text-[9px] font-mono opacity-20">V-0{idx + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="p-10 flex justify-center items-center relative z-50">
           <div className="flex gap-3">
              {questions.map((_, i) => (
                <div key={i} className={cn(
                  "h-1 rounded-full transition-all duration-700",
                  i === currentQuestion ? 'w-12 bg-brand-blue' : 
                  i < currentQuestion ? 'w-6 bg-brand-green' : 'w-6 bg-white/10'
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
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-12 p-6 animate-in fade-in zoom-in duration-700">
        <div className="bg-brand-blue/10 p-8 rounded-[3rem] inline-flex mb-4">
           <Award className="h-16 w-16 text-brand-blue" />
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-brand-blue leading-none">{score}%</h1>
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-gray-400">Integridad Neural Certificada</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-8">
           <Link href="/dashboard" className="w-full">
             <Button className="w-full h-14 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Actualizar Perfil</Button>
           </Link>
           <Button onClick={handleExit} variant="outline" className="h-14 w-full rounded-2xl border-gray-200 font-bold uppercase tracking-widest text-xs">Reintentar</Button>
        </div>
      </div>
    );
  }

  return null;
}
