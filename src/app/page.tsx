
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { Layers, Cpu, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, Float, Center } from "@react-three/drei";
import * as THREE from "three";

function LaptopModel({ progress }: { progress: number }) {
  const { scene } = useGLTF("/models/laptop.glb");
  const scrollGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (scrollGroupRef.current) {
      // Rotación suave basada únicamente en el scroll
      const targetRotationY = (progress * Math.PI * 0.4) - (Math.PI / 6);
      scrollGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        scrollGroupRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      // Inclinación sutil basada en el scroll
      scrollGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        scrollGroupRef.current.rotation.x,
        Math.max(0, (0.1 - progress) * 0.1),
        0.05
      );
    }
  });

  return (
    <group ref={scrollGroupRef} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

function Loader3D() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00ACEE" wireframe />
    </mesh>
  );
}

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lineProgress, setLineProgress] = useState(0); 
  const lineSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (lineSectionRef.current) {
        const rect = lineSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = rect.height - windowHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
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
      color: "bg-brand-blue",
      hoverBg: "hover:bg-brand-blue/5"
    },
    {
      title: "Feedback en Tiempo Real",
      description: "Recibe un desglose detallado de tu DNA técnico inmediatamente después de cada prueba.",
      color: "bg-brand-orange",
      hoverBg: "hover:bg-brand-orange/5"
    },
    {
      title: "Identidad Verificada",
      description: "Un perfil de Nextape es una prueba irrefutable de maestría técnica para las mejores empresas del mundo.",
      color: "bg-brand-green",
      hoverBg: "hover:bg-brand-green/5"
    }
  ];

  const lineStages = [
    {
      title: "Análisis de sinapsis técnica.",
      description: "The LINE es un entorno de ejecución pura. Evaluamos no solo lo que sabes, sino cómo reaccionas ante el fallo sistémico.",
      icon: Cpu
    },
    {
      title: "Escenarios de alto impacto.",
      description: "Desde cuellos de botella en sistemas distribuidos hasta optimización de renderizado en tiempo real. Sin distracciones.",
      icon: Zap
    },
    {
      title: "Tu DNA, verificado.",
      description: "Al finalizar, obtienes una firma digital única que certifica tu nivel de arquitectura y resolución. La prueba para el 1%.",
      icon: ShieldCheck
    }
  ];

  const isDarkMode = lineProgress > 0.1;

  return (
    <div className={cn(
      "flex flex-col min-h-screen transition-colors duration-1000 ease-in-out",
      isDarkMode ? "bg-black text-white" : "bg-white text-foreground"
    )}>
      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        scrolled 
          ? (isDarkMode ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-4" : "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4") 
          : "bg-transparent py-6 md:py-8"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2">
             <div className="w-6 h-6 md:w-8 md:h-8 bg-brand-blue rounded-lg md:rounded-xl" />
             <span className={cn("transition-colors duration-500", isDarkMode ? "text-white" : "text-black")}>Nextape</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className={cn(
                "px-4 md:px-6 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500",
                isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-black/80 shadow-apple"
              )}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 pt-32 md:pt-48 pb-20 md:pb-32 max-w-7xl mx-auto text-center">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-black leading-[1.1] md:leading-[1] tracking-tighter italic">
              Level up <br />
              <span className="text-brand-blue">your code.</span> <br />
              Find your <br />
              <span className="text-brand-red">next tape.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed pt-4 md:pt-8 px-4">
              La plataforma de evaluación para desarrolladores que ven el código como un arte. Verificado por IA. Diseñado para maestros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 md:pt-12 px-6">
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-brand-blue text-white hover:bg-brand-blue/90 h-14 md:h-16 px-8 md:px-10 rounded-full text-xs md:text-sm font-bold shadow-apple-lg uppercase tracking-widest w-full sm:w-auto"
              >
                Empezar Ahora
              </Button>
              <Button 
                variant="outline"
                className="border-gray-200 h-14 md:h-16 px-8 md:px-10 rounded-full text-xs md:text-sm font-bold hover:bg-gray-50 transition-colors bg-white text-black uppercase tracking-widest w-full sm:w-auto"
              >
                Ver Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Sección: ¿Qué es Nextape? */}
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black">¿Qué es Nextape?</h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-medium">
                Nextape no es una bolsa de trabajo común. Es un ecosistema de validación técnica donde tu talento se cuantifica objetivamente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative bg-white p-8 md:p-12 rounded-none border-t-4 transition-all duration-500 cursor-default group overflow-hidden border-gray-100 shadow-sm",
                    f.hoverBg,
                    "hover:shadow-apple-lg hover:-translate-y-2"
                  )}
                >
                  <div className="relative z-10">
                    <div className={cn("w-full h-1 mb-6 md:mb-8 transition-colors duration-500", f.color)} />
                    <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-black uppercase tracking-tight group-hover:tracking-wider transition-all">
                      {f.title}
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed text-sm">
                      {f.description}
                    </p>
                  </div>
                  <div className={cn("absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500", f.color)} />
                </div>
              ))}
            </div>

            <div className="mt-16 md:mt-20 p-8 md:p-12 bg-gray-950 rounded-[2rem] md:rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group shadow-apple-lg">
               <div className="space-y-4 relative z-10 text-center md:text-left">
                 <h4 className="text-2xl md:text-3xl font-bold group-hover:text-brand-blue transition-colors">Lleva tu carrera al siguiente nivel.</h4>
                 <p className="text-gray-400 font-medium text-sm md:text-base">Únete a la élite de desarrolladores que ya están usando Nextape para certificar sus habilidades.</p>
                 <div className="pt-4 flex justify-center md:justify-start">
                    <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full px-8 h-12 font-bold flex items-center gap-2 transition-transform hover:scale-105 uppercase text-[10px] tracking-widest">
                       Crear Perfil <ArrowRight className="h-4 w-4" />
                    </Button>
                 </div>
               </div>
               <div className="relative w-32 md:w-1/3 aspect-square opacity-20 md:opacity-100 group-hover:scale-110 transition-transform duration-700">
                  <Layers className="absolute inset-0 w-full h-full text-brand-blue" strokeWidth={0.5} />
               </div>
               <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Sección: The LINE - Scrollytelling 3D */}
        <section ref={lineSectionRef} className="relative h-[400vh]">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 w-full h-full">
              
              {/* Contenedor de Texto Dinámico - Siempre encima en móvil */}
              <div className="relative h-[300px] md:h-[500px] flex items-center z-20 order-2 lg:order-1">
                {lineStages.map((stage, i) => {
                  const start = i * 0.33;
                  const end = (i + 1) * 0.33;
                  const isActive = lineProgress >= start && lineProgress < end;
                  const opacity = isActive ? 1 : 0;
                  const translate = isActive ? "translate-y-0" : (lineProgress > end ? "-translate-y-8" : "translate-y-8");

                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "absolute inset-0 flex flex-col justify-center space-y-4 md:space-y-6 transition-all duration-700 ease-in-out text-center lg:text-left",
                        opacity === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                        translate
                      )}
                    >
                      <div className="flex justify-center lg:justify-start">
                        <stage.icon className="h-8 w-8 md:h-10 md:w-10 text-brand-blue mb-2" />
                      </div>
                      <h2 className="text-3xl md:text-6xl font-headline font-black italic leading-tight text-white">
                        {stage.title}
                      </h2>
                      <p className="text-sm md:text-lg text-gray-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                        {stage.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Visual 3D Container - Ajustado para móvil */}
              <div className={cn(
                "transition-all duration-1000 h-full w-full flex items-center justify-center relative z-10 pointer-events-none order-1 lg:order-2",
                lineProgress > 0.01 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}>
                <div className="w-full h-[40vh] md:h-[60vh] lg:h-[80vh] relative">
                  <Canvas 
                    shadows 
                    camera={{ position: [0, 0, 15], fov: 35 }}
                    style={{ background: 'transparent' }}
                  >
                    <Suspense fallback={<Loader3D />}>
                      <Stage environment="studio" intensity={0.8} contactShadow={{ opacity: 0.5, blur: 2 }}>
                        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                          <Center top>
                            <LaptopModel progress={lineProgress} />
                          </Center>
                        </Float>
                      </Stage>
                    </Suspense>
                  </Canvas>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={cn(
          "py-16 md:py-24 px-6 border-t transition-colors duration-1000",
          isDarkMode ? "bg-black border-white/10 text-white" : "bg-white border-gray-100 text-foreground"
        )}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <div className="text-2xl font-bold tracking-tighter">Nextape</div>
              <p className="text-gray-400 max-w-xs font-medium">Diseñado para los maestros del código. Tokyo & Worldwide.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 w-full md:w-auto">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plataforma</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-400">
                  <li><Link href="#" className="hover:text-brand-blue">Panel</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Evaluaciones</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Empleos</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compañía</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-400">
                  <li><Link href="#" className="hover:text-brand-blue">Manifiesto</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Carreras</Link></li>
                  <li><Link href="#" className="hover:text-brand-blue">Blog</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Legal</p>
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
