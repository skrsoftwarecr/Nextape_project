
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Zap, ShieldCheck, Layers, Terminal, ArrowRight, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lineProgress, setLineProgress] = useState(0); // 0 to 1
  const lineSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (lineSectionRef.current) {
        const rect = lineSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate progress based on how much of the section is visible
        // Start fading when the top of section reaches bottom of viewport
        // Complete fade when top of section reaches top of viewport
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
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
      icon: Cpu,
      color: "bg-brand-blue"
    },
    {
      title: "Feedback en Tiempo Real",
      description: "Recibe un desglose detallado de tu DNA técnico inmediatamente después de cada prueba.",
      icon: Zap,
      color: "bg-brand-orange"
    },
    {
      title: "Identidad Verificada",
      description: "Un perfil de Nextape es una prueba irrefutable de maestría técnica para las mejores empresas del mundo.",
      icon: ShieldCheck,
      color: "bg-brand-green"
    }
  ];

  return (
    <div className={cn(
      "flex flex-col min-h-screen transition-colors duration-700",
      lineProgress > 0.5 ? "bg-black text-white" : "bg-white text-foreground"
    )}>
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/70 backdrop-blur-xl border-b border-gray-100 py-4 dark:bg-black/70" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
             <div className="w-8 h-8 bg-brand-blue rounded-xl" />
             <span className={lineProgress > 0.5 ? "text-white" : "text-black"}>Nextape</span>
          </div>
          <div className="flex items-center gap-8">
            <button className={cn("hidden md:block text-sm font-semibold transition-colors", lineProgress > 0.5 ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-brand-blue")}>Process</button>
            <button className={cn("hidden md:block text-sm font-semibold transition-colors", lineProgress > 0.5 ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-brand-blue")}>Pricing</button>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className={cn(
                "px-6 py-5 rounded-full text-sm font-bold tracking-tight shadow-apple transition-all",
                lineProgress > 0.5 ? "bg-white text-black hover:bg-gray-200" : "bg-gray-950 text-white hover:bg-black"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-apple hover:shadow-apple-lg transition-all border border-gray-100 group">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform", f.color)}>
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-black">{f.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-20 p-12 bg-gray-950 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
               <div className="space-y-4 relative z-10">
                 <h4 className="text-3xl font-bold">Lleva tu carrera al siguiente nivel.</h4>
                 <p className="text-gray-400 font-medium">Únete a la élite de desarrolladores que ya están usando Nextape para certificar sus habilidades.</p>
                 <div className="pt-4">
                    <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full px-8 h-12 font-bold flex items-center gap-2">
                       Crear Perfil <ArrowRight className="h-4 w-4" />
                    </Button>
                 </div>
               </div>
               <div className="relative w-full md:w-1/3 aspect-square opacity-20 md:opacity-100">
                  <Layers className="absolute inset-0 w-full h-full text-brand-blue" strokeWidth={0.5} />
               </div>
            </div>
          </div>
        </section>

        {/* Sección: The LINE - Cinematic Scroll Experience */}
        <section ref={lineSectionRef} className="relative min-h-[150vh] flex flex-col items-center">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 w-full">
              
              <div className={cn(
                "transition-all duration-1000 space-y-8 text-center lg:text-left",
                lineProgress > 0.3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/10 rounded-full text-brand-red text-xs font-bold uppercase tracking-widest mb-4 border border-brand-red/20">
                  <Terminal className="h-3 w-3" /> Cinematic Assessment
                </div>
                <h2 className="text-5xl md:text-7xl font-headline font-black italic text-white leading-tight">
                  Presentando <br />
                  <span className="text-brand-red">The LINE.</span>
                </h2>
                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                  Más que una prueba de código. Es un entorno de inmersión total diseñado para separar a los programadores de los arquitectos. 
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                   <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <MousePointer2 className="h-4 w-4" /> Sin distracciones
                   </div>
                   <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <Zap className="h-4 w-4 text-brand-yellow" /> Reacción inmediata
                   </div>
                </div>
              </div>

              <div className={cn(
                "transition-all duration-1000 flex items-center justify-center",
                lineProgress > 0.4 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}>
                <div className="relative group w-full max-w-md md:max-w-xl">
                  {/* Laptop Mockup */}
                  <div className="bg-neutral-800 rounded-t-[2rem] p-3 shadow-2xl relative">
                    <div className="bg-black aspect-[16/10] rounded-xl overflow-hidden border-2 border-white/5 relative">
                       {/* Animated Glow on Screen */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-red/20 animate-pulse" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Terminal className="h-20 w-20 text-brand-red opacity-50 animate-bounce" />
                       </div>
                       <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-red w-2/3 animate-[loading_3s_infinite]" />
                       </div>
                    </div>
                  </div>
                  <div className="bg-neutral-700 h-4 rounded-b-[2rem] mx-auto w-[90%] shadow-lg" />
                  
                  {/* Particles / Background depth */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-red/10 blur-[100px] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={cn(
          "py-24 px-6 border-t transition-colors duration-700",
          lineProgress > 0.5 ? "bg-black border-white/10" : "bg-white border-gray-100"
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
