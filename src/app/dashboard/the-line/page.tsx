
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, X, AlertTriangle, Monitor, ArrowLeft, ArrowRight, Award } from "lucide-react";
import Link from "next/link";

type AssessmentState = "selector" | "immersive" | "results";

export default function TheLinePage() {
  const [viewState, setViewState] = useState<AssessmentState>("selector");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  const questions = [
    {
      text: "You are designing a high-throughput real-time dashboard. The data source is a fast-moving stream of trading data. Which strategy ensures UI consistency while minimizing main thread congestion?",
      options: [
        "Direct DOM updates per event received via WebSockets.",
        "Buffer events in a Web Worker, batch updates using requestAnimationFrame.",
        "Throttle data at the API Gateway level to 10 events per second.",
        "Use React Context with a high-frequency polling interval of 50ms."
      ],
      correct: 1,
      context: "Performance optimization in real-time environments requires decoupling data ingestion from UI rendering."
    },
    {
       text: "A distributed system experiences a network partition. According to the CAP theorem, if you choose Availability and Partition Tolerance (AP), what must you sacrifice?",
       options: [
         "Latency",
         "Consistency",
         "Throughput",
         "Durability"
       ],
       correct: 1,
       context: "The CAP theorem states that any distributed system can only provide two of the three: Consistency, Availability, and Partition Tolerance."
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewState === "immersive" && !typewriterComplete) {
      timer = setTimeout(() => setTypewriterComplete(true), 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentQuestion, viewState, typewriterComplete]);

  const handleStart = () => {
    setIsConfirmOpen(false);
    setViewState("immersive");
    localStorage.setItem("line_active", "true");
  };

  const handleExit = () => {
    setViewState("selector");
    localStorage.removeItem("line_active");
  };

  const handleAnswer = (index: number) => {
    if (showFeedback !== null) return;
    
    const isCorrect = index === questions[currentQuestion].correct;
    setAnswers({ ...answers, [currentQuestion]: index });
    setShowFeedback(isCorrect);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(null);
        setTypewriterComplete(false);
      } else {
        setViewState("results");
        localStorage.removeItem("line_active");
      }
    }, 2000);
  };

  if (viewState === "selector") {
    return (
      <div className="space-y-12 max-w-6xl mx-auto">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">The LINE.</h1>
          <p className="text-gray-500 font-medium">La evaluación definitiva para arquitectos de software.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 ml-1">Dificultad Neural</label>
              <Select defaultValue="master">
                <SelectTrigger className="bg-gray-50 border-none h-16 rounded-2xl text-lg font-bold px-6 focus:ring-1">
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
                  { id: "mc", name: "Multiple Choice", desc: "Arquitectura y Sistemas", active: true },
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
                The LINE no es un test común. Es un entorno de ejecución pura donde evaluamos tu capacidad de respuesta ante fallos sistémicos.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                  PANTALLA COMPLETA
                </div>
                <div className="bg-white/10 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                  SIN PAUSAS
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="border-none rounded-[3rem] p-12 bg-white max-w-xl shadow-apple-lg">
            <DialogHeader className="space-y-6">
              <div className="bg-brand-orange/10 p-6 rounded-[2rem] inline-flex w-fit mx-auto">
                <AlertTriangle className="h-12 w-12 text-brand-orange" />
              </div>
              <DialogTitle className="text-4xl font-bold tracking-tighter text-center leading-none">¿Estás preparado?</DialogTitle>
              <DialogDescription className="text-lg font-medium text-center text-gray-500 leading-relaxed px-4">
                Una vez que entres en la LINE, no podrás retroceder. Tus resultados quedarán firmados digitalmente en tu perfil de Nextape.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-4 mt-10">
              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} className="h-16 w-full rounded-2xl font-bold text-gray-400 hover:text-gray-600">
                Retirarse
              </Button>
              <Button onClick={handleStart} className="bg-gray-950 hover:bg-black text-white h-16 w-full rounded-2xl font-bold shadow-apple-lg">
                Iniciar Evaluación
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
        {/* Top Header */}
        <header className="p-8 flex justify-between items-center relative z-20">
          <button 
            onClick={handleExit}
            className="flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-[10px] text-white/30 hover:text-white transition-opacity"
          >
            <X className="h-4 w-4" /> Terminar Sesión
          </button>
          <div className="text-lg font-bold tracking-tighter text-white/10 font-mono">
            NEXTAPE_THE_LINE_v1.0.4
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Status: Running</span>
            <div className="h-2 w-2 rounded-full bg-brand-blue animate-pulse"></div>
          </div>
        </header>

        {/* Sidebar Context */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed left-0 top-1/2 -translate-y-1/2 w-8 h-32 bg-white/5 hover:bg-white/10 border-y border-r border-white/10 flex items-center justify-center z-30 transition-all rounded-r-2xl"
        >
          <div className="rotate-90 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 whitespace-nowrap">Briefing</div>
        </button>

        {isSidebarOpen && (
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-gray-950 border-r border-white/10 p-12 z-40 animate-in slide-in-from-left duration-300">
             <button onClick={() => setIsSidebarOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white">
                <X className="h-6 w-6" />
             </button>
             <div className="space-y-8 mt-12">
                <h3 className="text-2xl font-bold text-brand-blue tracking-tight">Mission Brief.</h3>
                <p className="text-white/50 text-sm leading-relaxed font-medium">
                  Evalúa precisión, velocidad y profundidad técnica. Objetivo: {q.text.slice(0, 40)}...
                </p>
                <div className="space-y-4 pt-8">
                   <div className="text-[9px] font-bold uppercase text-white/20 border-b border-white/5 pb-2 tracking-widest">Dimensión Técnica</div>
                   <div className="text-xl font-bold text-white/80">Distributed Systems</div>
                </div>
             </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center relative p-8 md:p-24 overflow-hidden">
          {/* Laptop Shell / Screen Visualizer */}
          <div className={`transition-all duration-1000 ease-in-out absolute ${showFeedback !== null ? 'opacity-0 scale-90' : 'opacity-100'} ${typewriterComplete ? 'md:left-1/4 scale-75' : 'left-1/2 -translate-x-1/2'}`}>
            <div className="relative">
              <div className="w-64 h-48 md:w-[500px] md:h-[350px] border-[12px] border-white/5 rounded-[2.5rem] relative bg-gray-900 flex items-center justify-center overflow-hidden shadow-2xl shadow-brand-blue/10">
                <div className={`absolute inset-0 transition-colors duration-500 ${showFeedback === true ? 'bg-brand-green/10' : showFeedback === false ? 'bg-brand-red/10' : 'bg-transparent'}`}></div>
                <div className="relative z-10 text-brand-blue/40 font-mono text-[8px] md:text-[11px] p-8 w-full space-y-2">
                  <div className="animate-pulse">_ EXEC_SYNC_PROCESS ... OK</div>
                  <div className="text-white/20">_ NEURAL_ANALYSIS ... IN_PROGRESS</div>
                  <div className="mt-8 border-l-2 border-brand-blue/20 pl-4 space-y-1">
                    {Array(10).fill(0).map((_, i) => (
                      <div key={i} className="mb-1 truncate opacity-50">{Math.random().toString(16).repeat(3)}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Panel */}
          <div className={`max-w-2xl w-full flex flex-col gap-10 transition-all duration-1000 ${typewriterComplete ? 'opacity-100 md:ml-auto md:w-1/2' : 'opacity-0 pointer-events-none'}`}>
             <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">Neural Challenge</span>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-snug tracking-tight">
                  {q.text}
                </h2>
             </div>

             <div className="space-y-4">
                {q.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-6 md:p-8 rounded-[1.5rem] border-2 text-left font-bold text-sm md:text-base transition-all group relative overflow-hidden ${
                      answers[currentQuestion] === idx 
                        ? (idx === q.correct ? 'bg-brand-green border-brand-green text-white' : 'bg-brand-red border-brand-red text-white')
                        : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                       <span className="pr-4">{opt}</span>
                       <span className="text-[10px] font-mono text-white/20 group-hover:text-white/40">0{idx + 1}</span>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Typewriter sequence */}
          {!typewriterComplete && (
            <div className="max-w-4xl w-full text-center relative z-10">
              <p className="text-4xl md:text-7xl font-bold text-white tracking-tighter italic animate-pulse">
                {currentQuestion === 0 ? "INITIATING_SYNC..." : "SYNCING_NEXT_STAGE..."}
              </p>
              <button 
                onClick={() => setTypewriterComplete(true)}
                className="mt-12 text-white/20 hover:text-white/60 font-bold uppercase tracking-[0.5em] text-[10px] flex items-center gap-2 mx-auto transition-colors"
              >
                SKIP_INITIALIZATION <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Progress */}
        <footer className="p-10 flex justify-between items-end relative z-20">
          <div className="flex gap-4">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 w-16 md:w-32 rounded-full transition-all duration-500 ${i <= currentQuestion ? 'bg-brand-blue shadow-[0_0_10px_rgba(0,172,238,0.5)]' : 'bg-white/10'}`}></div>
            ))}
          </div>
          <div className="text-right">
            <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 mb-1">Vector Identification</div>
            <div className="text-3xl font-black text-brand-blue tracking-tighter">Q{currentQuestion + 1} <span className="text-white/20 font-medium">/ {questions.length}</span></div>
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
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">Análisis <br /> Completado.</h1>
        </header>

        <div className="flex flex-col items-center">
          <div className="text-[12rem] md:text-[18rem] font-black leading-none italic text-brand-blue tracking-tighter">{score}</div>
          <div className="text-xl font-bold uppercase tracking-[0.3em] -mt-10 text-gray-400">Integridad Neural</div>
        </div>

        <div className="max-w-2xl bg-gray-950 rounded-[3rem] p-12 text-white shadow-apple-lg space-y-10 relative overflow-hidden group">
           <p className="text-2xl md:text-3xl font-bold leading-tight italic relative z-10">
             "{score >= 90 ? "SUPERIOR HYBRID PERFORMANCE. READY FOR TIER 1." : "COMPETENT EXECUTION. FURTHER DRILLS RECOMMENDED."}"
           </p>
           <div className="grid grid-cols-2 gap-8 text-left border-t border-white/10 pt-10 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Precisión</span>
                <p className="text-2xl font-bold text-brand-blue">NIVEL 9</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Eficiencia Lógica</span>
                <p className="text-2xl font-bold text-brand-green">96%</p>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg pt-6">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-16 bg-gray-950 hover:bg-black text-white rounded-2xl font-bold uppercase tracking-widest shadow-apple-lg active:scale-95 transition-all">
              Volver al Panel
            </Button>
          </Link>
          <Button 
            onClick={() => setViewState("selector")} 
            className="w-full h-16 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl font-bold uppercase tracking-widest border border-gray-100 shadow-apple active:scale-95 transition-all"
          >
            Revisar Errores
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
