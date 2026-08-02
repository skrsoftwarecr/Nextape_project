"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Cpu, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiPost } from "@/lib/api";
import { QuestionCard, QuestionTypeBadge } from "@/components/line/QuestionCard";
import type { Answer, PublicQuestion } from "@/types/question.types";

function LineContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  
  const [status, setStatus] = useState<"idle" | "loading" | "active" | "finished">("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  // La forma de cada respuesta depende del tipo de su pregunta (índice, booleano o array).
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [specialty, setSpecialty] = useState("frontend");
  const [difficulty, setLevel] = useState("senior");
  const [error, setError] = useState<string | null>(null);

  const startSimulation = async () => {
    setStatus("loading");
    setError(null);
    setScore(0);
    setAnswers([]);
    setCurrentQIndex(0);
    try {
      // Las preguntas se generan EN SERVIDOR y llegan SIN la respuesta correcta.
      const payload = jobId ? { jobId } : { specialty, level: difficulty };
      const data = await apiPost<{ sessionId: string; questions: PublicQuestion[] }>(
        "/api/line/start",
        payload
      );

      if (!data.questions || data.questions.length === 0) {
        setError("No se pudieron generar las preguntas. Inténtalo de nuevo en unos segundos.");
        setStatus("idle");
        return;
      }

      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setStatus("active");
    } catch (err) {
      console.error("Simulation failed to start:", err);
      setError("Error al iniciar la simulación. Revisa tu conexión e inténtalo de nuevo.");
      setStatus("idle");
    }
  };

  const finishSimulation = async (finalAnswers: Answer[]) => {
    setStatus("loading");
    try {
      // La corrección y la escritura del DNA ocurren EN SERVIDOR (no falsificable en cliente).
      const data = await apiPost<{ overall: number }>("/api/line/submit", {
        sessionId,
        answers: finalAnswers,
      });
      setScore(data.overall);
      setStatus("finished");
    } catch (err) {
      console.error("Failed to submit simulation:", err);
      setError("No se pudo calcular el resultado. Inténtalo de nuevo.");
      setStatus("idle");
    }
  };

  const handleAnswer = async (answer: Answer) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
    } else {
      await finishSimulation(updatedAnswers);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold italic">Sincronizando Entorno Neural...</p>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Generando escenarios técnicos reales</p>
        </div>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-10">
        <div className="w-24 h-24 bg-brand-green/10 rounded-full mx-auto flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-brand-green" />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black italic tracking-tighter">SIMULACIÓN COMPLETADA.</h2>
          <p className="text-gray-500 font-medium">Tus resultados han sido integrados en tu identidad CORE.</p>
        </div>
        <div className="bg-white p-12 rounded-[3rem] shadow-apple border border-gray-50 inline-block">
          <span className="text-8xl font-black text-brand-blue tracking-tighter italic">{score}%</span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 mt-4">Puntuación Verificada</span>
        </div>
        <div className="pt-10">
          <Button onClick={() => window.location.href = "/dashboard/core"} className="h-16 px-12 bg-black text-white rounded-2xl font-bold uppercase tracking-widest shadow-apple-lg">Ir al CORE</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-black italic">The LINE.</h1>
        <p className="text-gray-500 font-medium text-sm">Evaluación técnica generada por IA para tu stack específico.</p>
      </header>

      {status === "idle" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-apple border border-gray-50 space-y-10">
            <div className="space-y-4">
               <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                  <Cpu className="h-7 w-7 text-brand-blue" />
               </div>
               <h2 className="text-2xl font-bold italic">Configuración Neural.</h2>
               <p className="text-sm text-gray-400 font-medium leading-relaxed">
                 {jobId ? "Simulación personalizada para la vacante seleccionada." : "Prepara el entorno de simulación basado en tu perfil digital."}
               </p>
            </div>

            <div className="space-y-6">
              {!jobId && (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Especialidad</label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                      <SelectTrigger className="bg-gray-50 border-none h-16 rounded-2xl font-bold text-lg px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-apple-lg">
                        <SelectItem value="frontend">Arquitectura Frontend</SelectItem>
                        <SelectItem value="backend">Backend y Sistemas</SelectItem>
                        <SelectItem value="devops">Cloud y DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-1">Nivel Objetivo</label>
                    <Select value={difficulty} onValueChange={setLevel}>
                      <SelectTrigger className="bg-gray-50 border-none h-16 rounded-2xl font-bold text-lg px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-apple-lg">
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-center gap-2 text-brand-red text-xs font-bold bg-brand-red/5 p-4 rounded-xl">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              <Button
                onClick={startSimulation}
                className="w-full h-16 bg-black text-white rounded-2xl text-base font-bold shadow-apple uppercase tracking-widest hover:scale-[1.02] transition-transform"
              >
                Iniciar Sincronización
              </Button>
            </div>
          </div>

          <div className="bg-brand-blue p-12 rounded-[2.5rem] text-white flex flex-col justify-center space-y-6 shadow-apple-lg relative overflow-hidden">
             <h3 className="text-4xl font-black italic tracking-tighter leading-none">Validación Dinámica.</h3>
             <p className="text-lg opacity-80 font-medium leading-relaxed">No evaluamos lo que sabes, sino cómo resuelves bajo presión técnica real.</p>
             <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-[100] bg-black text-white p-6 md:p-12 flex flex-col items-center justify-center space-y-12">
          <div className="flex items-center justify-between w-full max-w-4xl border-b border-white/10 pb-8">
             <div className="flex items-center gap-4">
                <Terminal className="h-6 w-6 text-brand-blue" />
                <h2 className="text-xl font-black italic tracking-tighter uppercase">THE_LINE_ENV_01</h2>
             </div>
             <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
               Pregunta {currentQIndex + 1} de {questions.length}
             </div>
          </div>

          <div className="max-w-2xl w-full p-8 md:p-12 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-10 backdrop-blur-3xl max-h-[70vh] overflow-y-auto">
             <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-block px-3 py-1 bg-brand-blue/20 text-brand-blue rounded-full text-[9px] font-bold uppercase tracking-widest">
                    {questions[currentQIndex].tag}
                  </div>
                  <QuestionTypeBadge type={questions[currentQIndex].type} />
                </div>
                {questions[currentQIndex].briefing && (
                  <p className="text-sm text-gray-400 font-medium leading-relaxed border-l-2 border-white/10 pl-4">
                    {questions[currentQIndex].briefing}
                  </p>
                )}
                <p className="text-xl md:text-2xl font-bold leading-tight tracking-tight italic">
                  {questions[currentQIndex].text}
                </p>
             </div>
             {/* `key` reinicia el estado local del componente al cambiar de pregunta
                 (selecciones a medias de multi_select / ordering). */}
             <QuestionCard
               key={questions[currentQIndex].id}
               question={questions[currentQIndex]}
               onAnswer={handleAnswer}
             />
          </div>
          <div className="flex gap-10">
            <div className="text-center">
              <span className="block text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">Latencia</span>
              <span className="text-xs font-mono">12ms</span>
            </div>
            <div className="text-center">
              <span className="block text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">Seguridad</span>
              <span className="text-xs font-mono text-brand-green">Cifrado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LinePage() {
  return (
    <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <LineContent />
    </Suspense>
  );
}
