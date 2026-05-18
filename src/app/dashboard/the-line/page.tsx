
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, X, AlertTriangle, Monitor, ArrowLeft, ArrowRight } from "lucide-react";
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
      <div className="space-y-12">
        <header className="border-b-4 border-black pb-8">
          <h1 className="text-6xl font-headline font-black uppercase italic tracking-tighter">The LINE.</h1>
          <p className="text-xl font-bold uppercase opacity-60">The ultimate developer assessment.</p>
        </header>

        <div className="max-w-4xl space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-40">Difficulty</label>
                <Select defaultValue="master">
                  <SelectTrigger className="border-4 border-black rounded-none h-16 text-lg font-black uppercase italic">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none">
                    <SelectItem value="apprentice" className="font-bold">APPRENTICE</SelectItem>
                    <SelectItem value="expert" className="font-bold">EXPERT</SelectItem>
                    <SelectItem value="master" className="font-bold">MASTER (TAPE-READY)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-40">Specialty</label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: "mc", name: "Multiple Choice (ACTIVE)", active: true },
                    { id: "debug", name: "Live Debugging (COMING SOON)", active: false },
                    { id: "arch", name: "Architecture Diagram (COMING SOON)", active: false }
                  ].map(spec => (
                    <button 
                      key={spec.id}
                      disabled={!spec.active}
                      className={`p-6 border-4 text-left flex justify-between items-center transition-all ${spec.active ? "border-black hover:bg-accent cursor-pointer" : "border-black/10 opacity-40 cursor-not-allowed grayscale"}`}
                    >
                      <span className="font-black uppercase tracking-tight">{spec.name}</span>
                      {spec.active && <ChevronRight className="h-6 w-6" />}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setIsConfirmOpen(true)}
                className="w-full h-20 bg-secondary text-white font-black uppercase italic text-2xl tracking-tighter border-b-8 border-r-8 border-black active:translate-y-2 active:border-b-0 active:border-r-0 rounded-none mt-8"
              >
                Enter The LINE
              </Button>
            </div>

            <div className="bg-black text-white p-12 space-y-8 flex flex-col justify-center border-4 border-black">
              <Monitor className="h-12 w-12 text-primary" />
              <h2 className="text-4xl font-headline font-black uppercase italic tracking-tighter leading-none">High Contrast <br /> Narrative.</h2>
              <p className="text-lg opacity-80 leading-relaxed font-bold">
                The LINE is not a quiz. It is an immersive cinematic challenge. You will face real-world scenarios in a distraction-free environment. 
              </p>
              <div className="flex gap-4">
                <div className="bg-primary/20 p-4 border border-primary text-xs font-bold uppercase tracking-widest text-primary">
                  FULL SCREEN REQUIRED
                </div>
                <div className="bg-secondary/20 p-4 border border-secondary text-xs font-bold uppercase tracking-widest text-secondary">
                  NO SECOND CHANCES
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="border-4 border-black rounded-none p-12 bg-background max-w-xl">
            <DialogHeader className="space-y-4">
              <div className="bg-accent p-4 border-2 border-black inline-flex w-fit mx-auto">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <DialogTitle className="text-5xl font-headline font-black uppercase italic text-center leading-none">Are you <br /> Prepared?</DialogTitle>
              <DialogDescription className="text-xl font-bold text-center uppercase tracking-tighter leading-tight pt-4">
                Once you enter the LINE, you cannot pause. Your results will be permanently attached to your NEXTAPE profile.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-4 mt-8">
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)} className="border-4 border-black rounded-none h-14 w-full font-black uppercase tracking-widest">
                Retreat
              </Button>
              <Button onClick={handleStart} className="bg-black text-white hover:bg-black/90 rounded-none h-14 w-full font-black uppercase tracking-widest">
                Enter Immersive
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
      <div className="fixed inset-0 z-[100] line-assessment-bg flex flex-col overflow-hidden select-none">
        {/* Top Header */}
        <header className="p-8 flex justify-between items-center relative z-20">
          <button 
            onClick={handleExit}
            className="flex items-center gap-2 font-black uppercase tracking-[0.2em] text-xs opacity-40 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" /> Terminate Session
          </button>
          <div className="text-xl font-headline italic tracking-tighter opacity-20">
            NEXTAPE_THE_LINE_v1.0.4
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Status: Running</span>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          </div>
        </header>

        {/* Sidebar Context */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed left-0 top-1/2 -translate-y-1/2 w-8 h-32 bg-primary/20 hover:bg-primary/40 border-y border-r border-white/20 flex items-center justify-center z-30 transition-all"
        >
          <div className="rotate-90 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Context Info</div>
        </button>

        {isSidebarOpen && (
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-black border-r border-white/20 p-12 z-40 animate-in slide-in-from-left duration-300">
             <button onClick={() => setIsSidebarOpen(false)} className="absolute top-8 right-8 text-white/40 hover:text-white">
                <X className="h-6 w-6" />
             </button>
             <div className="space-y-8 mt-12">
                <h3 className="text-2xl font-headline italic uppercase text-primary">Mission Brief.</h3>
                <p className="opacity-60 text-sm leading-relaxed font-bold">
                  You are evaluated on precision, speed, and conceptual depth. The current objective: {q.text.slice(0, 30)}...
                </p>
                <div className="space-y-4 pt-8">
                   <div className="text-[10px] font-black uppercase opacity-40 border-b border-white/10 pb-2">Technical Dimension</div>
                   <div className="text-xl font-headline italic">Distributed Systems</div>
                </div>
             </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center relative p-8 md:p-24 overflow-hidden">
          {/* Laptop Placeholder / Three.js Placeholder */}
          <div className={`transition-all duration-1000 ease-in-out absolute ${showFeedback !== null ? 'opacity-0' : 'opacity-100'} ${typewriterComplete ? 'md:left-1/4 scale-75' : 'left-1/2 -translate-x-1/2'}`}>
            <div className="relative group cursor-default">
              {/* Laptop Shell */}
              <div className="w-64 h-48 md:w-96 md:h-64 border-4 border-white relative bg-black flex items-center justify-center overflow-hidden">
                {/* Screen Content */}
                <div className={`absolute inset-0 transition-colors duration-500 ${showFeedback === true ? 'bg-[#022c22]' : showFeedback === false ? 'bg-[#450a0a]' : 'bg-transparent'}`}></div>
                
                {/* Independent Screen Element */}
                <div className="relative z-10 text-white font-mono text-[8px] md:text-[10px] opacity-40 p-4 w-full">
                  <div className="animate-pulse">_ EXEC_PROCESS ... OK</div>
                  <div>_ ANALYZING_NEURAL_LINK ... IN_PROGRESS</div>
                  <div className="mt-4 border-l border-white/40 pl-2">
                    {Array(8).fill(0).map((_, i) => (
                      <div key={i} className="mb-1">{Math.random().toString(16)}</div>
                    ))}
                  </div>
                </div>

                {/* 
                  IMPORTANT: THREE.JS INTEGRATION POINT
                  Replace this placeholder with the .glb laptop model.
                  The independent screen material should react to the 'showFeedback' state.
                */}
              </div>
              <div className="w-72 h-4 md:w-[420px] md:h-6 bg-white/20 mt-1 mx-auto"></div>
            </div>
          </div>

          {/* Question Panel */}
          <div className={`max-w-2xl w-full flex flex-col gap-12 transition-all duration-1000 ${typewriterComplete ? 'opacity-100 md:ml-auto md:w-1/2' : 'opacity-0 pointer-events-none'}`}>
             <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Dimension: Performance Optimization</span>
                <h2 className="text-3xl md:text-5xl font-headline italic font-bold leading-tight">
                  {q.text}
                </h2>
             </div>

             <div className="space-y-4">
                {q.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-6 border-2 text-left font-bold uppercase tracking-wide transition-all ${
                      answers[currentQuestion] === idx 
                        ? (idx === q.correct ? 'bg-primary text-white border-primary' : 'bg-secondary text-white border-secondary')
                        : 'border-white/10 hover:border-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                       <span>{opt}</span>
                       <span className="opacity-20 font-headline italic ml-4">0{idx + 1}</span>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Narrative Text Layer (Initial Typewriter) */}
          {!typewriterComplete && (
            <div className="max-w-4xl w-full text-center relative z-10 px-6">
              <p className="text-3xl md:text-6xl font-headline italic font-black text-white leading-tight typewriter-text overflow-hidden animate-typewriter whitespace-nowrap md:whitespace-normal">
                {currentQuestion === 0 ? "INITIATING NEURAL SYNAPSE ANALYSIS..." : "PREPARING NEXT DIMENSION..."}
              </p>
              <button 
                onClick={() => setTypewriterComplete(true)}
                className="mt-12 opacity-40 hover:opacity-100 font-black uppercase tracking-[0.5em] text-xs flex items-center gap-2 mx-auto"
              >
                SKIP SEQUENCE <ArrowRight className="h-4 w-4" />
              </button>
              
              {/* Auto-advance typewriter */}
              {useEffect(() => {
                const timer = setTimeout(() => setTypewriterComplete(true), 3000);
                return () => clearTimeout(timer);
              }, [currentQuestion])}
            </div>
          )}
        </div>

        {/* Footer Progress */}
        <footer className="p-8 flex justify-between items-end relative z-20">
          <div className="flex gap-4">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 w-12 md:w-24 border ${i <= currentQuestion ? 'bg-primary border-primary' : 'bg-transparent border-white/20'}`}></div>
            ))}
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Vector Identification</div>
            <div className="text-2xl font-headline italic text-primary">Q{currentQuestion + 1} / {questions.length}</div>
          </div>
        </footer>
      </div>
    );
  }

  if (viewState === "results") {
    const score = Math.round((Object.values(answers).filter((a, i) => a === questions[i].correct).length / questions.length) * 100);

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12 py-24">
        <header className="space-y-4">
          <div className="bg-primary p-6 border-4 border-black inline-flex">
            <Award className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-8xl font-headline font-black uppercase italic tracking-tighter">Analysis <br /> Complete.</h1>
        </header>

        <div className="flex flex-col items-center">
          <div className="text-[12rem] md:text-[16rem] font-headline font-black leading-none italic text-secondary">{score}</div>
          <div className="text-xl font-black uppercase tracking-widest -mt-12 opacity-60">Final Neural Integrity Score</div>
        </div>

        <div className="max-w-2xl border-4 border-black p-12 bg-black text-white space-y-8">
           <p className="text-2xl font-bold uppercase leading-tight italic">
             "{score >= 90 ? "SUPERIOR HYBRID PERFORMANCE DETECTED. YOU ARE READY FOR TIER 1 PLACEMENT." : "COMPETENT EXECUTION. FURTHER DIMENSIONAL DRILLS RECOMMENDED."}"
           </p>
           <div className="grid grid-cols-2 gap-8 text-left border-t border-white/20 pt-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Precision</span>
                <p className="text-xl font-bold uppercase text-primary">LEVEL 9</p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">System Logic</span>
                <p className="text-xl font-bold uppercase text-accent">96% EFFICIENCY</p>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-16 bg-black text-white font-black uppercase tracking-widest border-b-4 border-r-4 border-secondary hover:bg-black/90 active:translate-y-1 active:border-b-0 active:border-r-0 rounded-none">
              Return to Panel
            </Button>
          </Link>
          <Button 
            onClick={() => setViewState("selector")} 
            className="w-full h-16 bg-white text-black font-black uppercase tracking-widest border-4 border-black hover:bg-muted active:translate-y-1 rounded-none"
          >
            Review Errors
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
