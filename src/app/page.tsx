
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { Layers, Terminal, ArrowRight, MousePointer2, Cpu, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lineProgress, setLineProgress] = useState(0); 
  const lineSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (lineSectionRef.current) {
        const rect = lineSectionRef.current.getBoundingClientRect();
        const scrollStart = rect.top;
        const totalHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Calculamos el progreso basado en cuánto de la sección ha pasado por la pantalla
        const progress = Math.max(0, Math.min(1, (windowHeight - scrollStart) / (totalHeight + windowHeight)));
        setLineProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      title: "Validación de Intuición",
      description: "No solo evaluamos sintaxis, sino la capacidad de tomar decisiones arquitectónicas bajo presión.",
      color: "border-brand-blue",
      hoverBg: "hover:bg-brand-blue/5"
    },
    {
      title: "Feedback en Tiempo Real",
      description: "Recibe un desglose detallado de tu DNA técnico inmediatamente después de cada prueba.",
      color: "border-brand-orange",
      hoverBg: "hover:bg-brand-orange/5"
    },
    {
      title: "Identidad Verificada",
      description: "Un perfil de Nextape es una prueba irrefutable de maestría técnica para las mejores empresas del mundo.",
      color: "border-brand-green",
      hoverBg: "hover:bg-brand-green/5"
    }
  ];

  const lineStages = [
    {
      title: "No es un test. Es un análisis de sinapsis.",
      description: "The LINE es un entorno de ejecución pura. Evaluamos no solo lo que sabes, sino cómo reaccionas ante el fallo sistémico.",
      icon: Cpu
    },
    {
      title: "Escenarios de alto impacto.",
      description: "Desde cuellos de botella en sistemas distribuidos hasta optimización de renderizado en tiempo real. Sin distracciones, solo tú y el código.",
      icon: Zap
    },
    {
      title: "Tu DNA Técnico, Verificado.",
      description: "Al finalizar, obtienes una firma digital única que certifica tu nivel de arquitectura y resolución. La prueba definitiva para el 1%.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className={cn(
      "flex flex-col min-h-screen transition-colors duration-1000 ease-in-out",
      lineProgress > 0.15 ? "bg-black text-white" : "bg-white text-foreground"
    )}>
      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        scrolled || lineProgress > 0.15 ? "bg-black/70 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
             <div className="w-8 h-8 bg-brand-blue rounded-xl" />
             <span className={lineProgress > 0.15 ? "text-white" : "text-black"}>Nextape</span>
          </div>
          <div className="flex items-center gap-8">
            <button className={cn("hidden md:block text-sm font-semibold transition-colors", lineProgress > 0.15 ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-brand-blue")}>Process</button>
            <button className={cn("hidden md:block text-sm font-semibold transition-colors", lineProgress > 0.15 ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-brand-blue")}>Pricing</button>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className={cn(
                "px-6 py-5 rounded-full text-sm font-bold tracking-tight shadow-apple transition-all",
                lineProgress > 0.15 ? "bg-white text-black hover:bg-gray-200" : "bg-gray-950 text-white hover:bg-black"
              )}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 pt-48 pb-32 max-w-7xl mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-headline font-black leading-[1] tracking-tighter italic">
              Level up <br />
              <span className="text-brand-blue">your code.</span> <br />
              Find your <br />
              <span className="text-brand-red">next tape.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed pt-8">
              La plataforma de evaluación para desarrolladores que ven el código como un arte. Verificado por IA. Diseñado para maestros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-brand-blue text-white hover:bg-brand-blue/90 h-16 px-10 rounded-full text-lg font-bold shadow-apple-lg"
              >
                Empezar Ahora
              </Button>
              <Button 
                variant="outline"
                className="border-gray-200 h-16 px-10 rounded-full text-lg font-bold hover:bg-gray-50 transition-colors bg-white text-black"
              >
                Ver Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Sección: ¿Qué es Nextape? */}
        <section className="py-32 px-6 bg-gray-50 dark:bg-neutral-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">¿Qué es Nextape?</h2>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium">
                Nextape no es una bolsa de trabajo común. Es un ecosistema de validación técnica donde tu talento se cuantifica objetivamente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative bg-white p-12 rounded-none border-t-4 transition-all duration-500 cursor-default group overflow-hidden",
                    f.color,
                    f.hoverBg,
                    "hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2"
                  )}
                >
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 text-black uppercase tracking-tight group-hover:tracking-wider transition-all">
                      {f.title}
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg">
                      {f.description}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-current transition-all duration-500 group-hover:w-full opacity-30"></div>
                </div>
              ))}
            </div>

            <div className="mt-20 p-12 bg-gray-950 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group shadow-apple-lg">
               <div className="space-y-4 relative z-10">
                 <h4 className="text-3xl font-bold group-hover:text-brand-blue transition-colors">Lleva tu carrera al siguiente nivel.</h4>
                 <p className="text-gray-400 font-medium">Únete a la élite de desarrolladores que ya están usando Nextape para certificar sus habilidades.</p>
                 <div className="pt-4">
                    <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full px-8 h-12 font-bold flex items-center gap-2 transition-transform hover:scale-105">
                       Crear Perfil <ArrowRight className="h-4 w-4" />
                    </Button>
                 </div>
               </div>
               <div className="relative w-full md:w-1/3 aspect-square opacity-20 md:opacity-100 group-hover:scale-110 transition-transform duration-700">
                  <Layers className="absolute inset-0 w-full h-full text-brand-blue" strokeWidth={0.5} />
               </div>
               <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Sección: The LINE - Cinematic Scroll Experience */}
        <section ref={lineSectionRef} className="relative h-[400vh] bg-black">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 w-full">
              
              {/* Contenedor de Texto Dinámico */}
              <div className="relative h-[400px] flex items-center">
                {lineStages.map((stage, i) => {
                  // Cada etapa tiene un rango de progreso de 0.33
                  const start = i * 0.3;
                  const end = (i + 1) * 0.3;
                  const isActive = lineProgress >= start && lineProgress < end;
                  const opacity = isActive ? 1 : 0;
                  const translate = isActive ? "translate-y-0" : (lineProgress > end ? "-translate-y-12" : "translate-y-12");

                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "absolute inset-0 flex flex-col justify-center space-y-8 transition-all duration-700 ease-in-out text-center lg:text-left",
                        opacity === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                        translate
                      )}
                    >
                      <div className="flex justify-center lg:justify-start">
                        <stage.icon className="h-12 w-12 text-brand-red mb-4" />
                      </div>
                      <h2 className="text-5xl md:text-7xl font-headline font-black italic text-white leading-tight">
                        {stage.title.split('. ')[0]}. <br />
                        <span className="text-brand-red">{stage.title.split('. ')[1] || ""}</span>
                      </h2>
                      <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl">
                        {stage.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Visual de Laptop - Siempre Visible en la sección sticky */}
              <div className={cn(
                "transition-all duration-1000 flex items-center justify-center",
                lineProgress > 0.05 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}>
                <div className="relative group w-full max-w-md md:max-w-xl">
                  {/* Laptop Mockup Estilizado */}
                  <div className="bg-neutral-800 rounded-t-[2.5rem] p-4 shadow-2xl relative border border-white/5">
                    <div className="bg-black aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/5 relative">
                       {/* Overlay dinámico basado en el progreso */}
                       <div className={cn(
                         "absolute inset-0 bg-gradient-to-tr transition-opacity duration-1000",
                         lineProgress < 0.3 ? "from-brand-blue/20 to-brand-red/10" : 
                         lineProgress < 0.6 ? "from-brand-orange/20 to-brand-yellow/10" : 
                         "from-brand-green/20 to-brand-blue/10"
                       )} />
                       
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Terminal className={cn(
                            "h-20 w-20 transition-all duration-500",
                            lineProgress > 0.1 ? "text-brand-red opacity-50 scale-110" : "text-white opacity-10 scale-100"
                          )} />
                       </div>

                       {/* Código falso animado */}
                       <div className="absolute inset-x-8 top-8 space-y-2 opacity-20 font-mono text-[8px] text-white">
                          <div className="w-2/3 h-2 bg-white/20 rounded" />
                          <div className="w-1/2 h-2 bg-white/10 rounded" />
                          <div className="w-3/4 h-2 bg-white/20 rounded" />
                       </div>

                       <div className="absolute bottom-8 left-8 right-8 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-red transition-all duration-300" 
                            style={{ width: `${lineProgress * 100}%` }}
                          />
                       </div>
                    </div>
                  </div>
                  <div className="bg-neutral-700 h-5 rounded-b-[2.5rem] mx-auto w-[92%] shadow-lg border-t border-white/10" />
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-red/5 blur-[120px] rounded-full" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={cn(
          "py-24 px-6 border-t transition-colors duration-1000",
          lineProgress > 0.8 ? "bg-black border-white/10 text-white" : "bg-white border-gray-100 text-foreground"
        )}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <div className="text-2xl font-bold tracking-tighter">Nextape</div>
              <p className="text-gray-400 max-w-xs font-medium">Diseñado para los maestros del código. Tokyo & Worldwide.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Plataforma</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-400">
                  <li><Link href="#" className="hover:text-brand-blue">Panel</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Evaluaciones</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Empleos</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Compañía</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-400">
                  <li><Link href="#" className="hover:text-brand-blue">Manifiesto</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Carreras</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Blog</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Legal</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-400">
                  <li><Link href="#" className="hover:text-brand-blue">Privacidad</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Términos</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-gray-100/10 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            © 2024 NEXTAPE INC. IDENTIDAD VERIFICADA.
          </div>
        </footer>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

