"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { 
  Layers, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Minus,
  Briefcase,
  Users,
  Target,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, Float, Center } from "@react-three/drei";
import * as THREE from "three";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

function LaptopModel({ progress }: { progress: number }) {
  const { scene } = useGLTF("/models/laptop.glb");
  const scrollGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (scrollGroupRef.current) {
      const targetRotationY = (progress * Math.PI * 0.5) - (Math.PI / 4);
      scrollGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        scrollGroupRef.current.rotation.y,
        targetRotationY,
        0.08
      );
      scrollGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        scrollGroupRef.current.rotation.x,
        Math.max(0, (0.1 - progress) * 0.1),
        0.08
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lineStages = [
    {
      title: "Evaluación Dinámica Neural.",
      description: "Cada prueba en THE LINE es generada por IA según el perfil que busca el reclutador. Simulamos desafíos reales para medir cómo los candidatos piensan, resuelven y responden ante fallos e incidentes específicos para el puesto.",
    },
    {
      title: "Escenarios de alto impacto.",
      description: "Desde arquitectura de software y sistemas distribuidos hasta optimización de rendimiento, debugging avanzado e implementación de nuevas funcionalidades. Cada desafío evalúa habilidades reales en distintos entornos de desarrollo.",
    },
    {
      title: "Evaluación basada en desempeño real.",
      description: "Los resultados permiten identificar cómo cada candidato analiza, resuelve y ejecuta frente a desafíos técnicos alineados al rol.",
    }
  ];

  const isDarkMode = lineProgress > 0.05;

  return (
    <div className={cn(
      "flex flex-col min-h-screen transition-colors duration-1000 ease-in-out",
      isDarkMode ? "bg-black text-white" : "bg-[#F5F5F7] text-foreground"
    )}>
      {/* 1. Navbar */}
      <nav className={cn(
        "fixed top-0 w-full z-[100] transition-all duration-500",
        scrolled 
          ? (isDarkMode ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-3" : "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3") 
          : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2">
             <div className="w-6 h-6 md:w-8 md:h-8 bg-brand-blue rounded-lg md:rounded-xl" />
             <span className={cn("transition-colors duration-500", isDarkMode ? "text-white" : "text-black")}>Nextape</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#problem" className="text-xs font-bold uppercase tracking-widest hover:text-brand-blue transition-colors">Problema</Link>
            <Link href="#how-it-works" className="text-xs font-bold uppercase tracking-widest hover:text-brand-blue transition-colors">Cómo funciona</Link>
            <Link href="#faq" className="text-xs font-bold uppercase tracking-widest hover:text-brand-blue transition-colors">FAQ</Link>
          </div>
          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            className={cn(
              "px-5 py-5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500",
              isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-black/80 shadow-apple"
            )}
          >
            Comenzar Gratis
          </Button>
        </div>
      </nav>

      <main className="flex-grow">
        {/* 2. Hero Section */}
        <section className="px-6 pt-32 md:pt-48 pb-20 md:pb-32 max-w-7xl mx-auto text-center relative overflow-hidden">
          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest animate-fade-in">
              <Zap className="h-3 w-3" /> Hiring de precisión por IA
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] font-headline font-black leading-[1] md:leading-[0.9] tracking-tighter italic">
              Contrata <span className="text-brand-blue">talento</span> que <br className="hidden md:block" />
              demuestra lo que sabe, <br className="hidden md:block" />
              <span className="text-brand-red">no lo que dice.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed px-4">
              Validamos habilidades técnicas reales a través de simulaciones generadas por IA. La confianza que necesitas para contratar developers de élite sin filtros innecesarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 md:pt-10 px-6">
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-brand-blue text-white hover:bg-brand-blue/90 h-14 md:h-16 px-8 md:px-12 rounded-full text-xs md:text-sm font-bold shadow-apple-lg uppercase tracking-widest w-full sm:w-auto transition-transform hover:scale-105"
              >
                Soy Developer - Validarme
              </Button>
              <Button 
                variant="outline"
                className="border-gray-200 h-14 md:h-16 px-8 md:px-12 rounded-full text-xs md:text-sm font-bold hover:bg-gray-50 transition-all bg-white text-black uppercase tracking-widest w-full sm:w-auto"
              >
                Soy Empresa - Ver Demo
              </Button>
            </div>
          </div>
          {/* Background Decorative Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-brand-blue/5 rounded-full blur-[120px] -z-10" />
        </section>

        {/* 3. Social Proof Bar */}
        <section className="py-12 border-y border-gray-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">Con la confianza de +100 empresas de alto impacto</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale">
              <div className="text-xl font-bold tracking-tighter">Vercel</div>
              <div className="text-xl font-bold tracking-tighter">Stripe</div>
              <div className="text-xl font-bold tracking-tighter">Linear</div>
              <div className="text-xl font-bold tracking-tighter">Prisma</div>
              <div className="text-xl font-bold tracking-tighter">Fly.io</div>
            </div>
          </div>
        </section>

        {/* 4. Problem Section */}
        <section id="problem" className="py-24 md:py-40 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black leading-tight">
                El hiring técnico <br /> <span className="text-brand-red">está roto.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-white rounded-[1.5rem] shadow-apple border border-gray-50">
                  <XCircle className="h-6 w-6 text-brand-red shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">CVs vs Realidad</h4>
                    <p className="text-gray-500 text-sm font-medium">LinkedIn está lleno de palabras vacías. Un "Senior" en papel puede no saber debugear una arquitectura distribuida hoy.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white rounded-[1.5rem] shadow-apple border border-gray-50">
                  <XCircle className="h-6 w-6 text-brand-red shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Pruebas Genéricas</h4>
                    <p className="text-gray-500 text-sm font-medium">Los desafíos de algoritmos (LeetCode) no predicen cómo un developer reacciona ante un fallo en producción.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white rounded-[1.5rem] shadow-apple border border-gray-50">
                  <XCircle className="h-6 w-6 text-brand-red shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Ruido y Fricción</h4>
                    <p className="text-gray-500 text-sm font-medium">Las empresas pierden 40+ horas en entrevistas con candidatos que no tienen el nivel técnico real requerido.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="bg-gray-950 p-8 md:p-12 rounded-[2.5rem] text-white shadow-apple-lg relative overflow-hidden group">
                  <h3 className="text-2xl font-bold mb-4">"Perdemos semanas filtrando CVs que parecen perfectos pero fallan en lo básico."</h3>
                  <p className="text-brand-blue font-bold uppercase tracking-widest text-xs">— CTO de una Serie B</p>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand-red/10 rounded-full blur-3xl" />
               </div>
            </div>
          </div>
        </section>

        {/* 5. How it Works / Solution Section */}
        <section id="how-it-works" className="py-24 md:py-40 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black">La Nueva Era de Validación</h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                Un flujo diseñado para identificar la maestría técnica sin filtros subjetivos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Perfil Neural", desc: "La IA analiza tu stack y experiencia para diseñar una evaluación única para ti." },
                { step: "02", title: "THE LINE", desc: "Enfrentas escenarios de fallo reales generados dinámicamente. Nada de algoritmos de pizarra." },
                { step: "03", title: "Certificación", desc: "Tu score de desempeño se convierte en tu sello de confianza ante las mejores vacantes." }
              ].map((item, idx) => (
                <div key={idx} className="relative p-10 bg-[#F5F5F7] rounded-[2rem] space-y-6 hover:bg-brand-blue/5 transition-colors group">
                  <span className="text-5xl font-black text-brand-blue/10 group-hover:text-brand-blue/20 transition-colors">{item.step}</span>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. The LINE Section (Interactive Laptop) */}
        <section ref={lineSectionRef} className="relative h-[500vh]">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-4 md:gap-12 w-full h-full">
              
              <div className="relative h-[300px] md:h-[450px] flex items-center z-20 order-2 lg:order-1">
                {lineStages.map((stage, i) => {
                  const threshold = 1 / lineStages.length;
                  const start = i * threshold;
                  const end = (i + 1) * threshold;
                  
                  const isActive = lineProgress >= start && lineProgress < end;
                  const isPast = lineProgress >= end;

                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "absolute inset-0 flex flex-col justify-center space-y-4 md:space-y-6 transition-all duration-1000 ease-out text-center lg:text-left",
                        isActive ? "opacity-100 translate-y-0 scale-100" : 
                        isPast ? "opacity-0 -translate-y-12 scale-95 blur-sm" : 
                        "opacity-0 translate-y-12 scale-95 blur-sm"
                      )}
                    >
                      <h2 className={cn(
                        "text-3xl md:text-5xl lg:text-6xl font-headline font-black italic leading-tight transition-colors duration-500",
                        isActive ? "text-brand-blue" : "text-white/20"
                      )}>
                        {stage.title}
                      </h2>
                      <p className="text-sm md:text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                        {stage.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className={cn(
                "transition-all duration-1000 h-full w-full flex items-center justify-center relative z-10 pointer-events-none order-1 lg:order-2",
                lineProgress > 0.01 ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}>
                <div className="w-full h-[40vh] md:h-[50vh] lg:h-[70vh] relative">
                  <Canvas 
                    shadows 
                    camera={{ position: [0, 0, 15], fov: 35 }}
                    style={{ background: 'transparent' }}
                  >
                    <Suspense fallback={<Loader3D />}>
                      <Stage environment="studio" intensity={0.8} contactShadow={{ opacity: 0.5, blur: 2 }}>
                        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                          <Center top position={[0, -0.5, 0]}>
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

        {/* 7. Differentiation Section */}
        <section className="py-24 md:py-40 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black text-center mb-16">¿Por qué Nextape?</h2>
            
            <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-apple-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-8 font-bold uppercase tracking-widest text-[10px] text-gray-400">Característica</th>
                    <th className="p-8 font-bold uppercase tracking-widest text-[10px] text-brand-blue bg-brand-blue/5">Nextape</th>
                    <th className="p-8 font-bold uppercase tracking-widest text-[10px] text-gray-400">Reclutamiento Tradicional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { feature: "Validación de Habilidades", next: "Simulación de Incidentes Real-Time", trad: "Filtros por Palabras Clave en CV" },
                    { feature: "Tiempo de Respuesta", next: "Instantáneo (Score Certificado)", trad: "2-3 Semanas de Entrevistas" },
                    { feature: "Precisión del Match", next: "92% Basado en Performance", trad: "30% Basado en Intuición" },
                    { feature: "Calidad del Candidato", next: "Elite Verified (The LINE)", trad: "Incierta hasta el Mes 1" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-8 font-bold text-sm md:text-base">{row.feature}</td>
                      <td className="p-8 text-brand-blue font-bold text-sm md:text-base bg-brand-blue/5">{row.next}</td>
                      <td className="p-8 text-gray-400 text-sm md:text-base">{row.trad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 9. Intermediate CTA */}
        <section className="px-6 py-20">
           <div className="max-w-7xl mx-auto p-12 md:p-20 bg-brand-blue rounded-[3rem] text-white text-center space-y-8 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">¿Listo para demostrar lo que vales?</h2>
                <p className="text-lg opacity-80 max-w-xl mx-auto font-medium">Entra en THE LINE hoy y conviértete en un developer certificado por la élite tech.</p>
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-black text-white hover:bg-black/80 h-16 px-12 rounded-full font-bold uppercase tracking-widest text-xs shadow-apple-lg transition-transform hover:scale-105"
                >
                  Empezar Evaluación
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
           </div>
        </section>

        {/* 10. FAQ Section */}
        <section id="faq" className="py-24 md:py-40 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Preguntas Frecuentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "¿Es gratis para desarrolladores?", a: "Sí, Nextape es y siempre será gratuito para los desarrolladores que buscan validar su talento y encontrar mejores oportunidades." },
                { q: "¿Cómo funciona la IA en THE LINE?", a: "Nuestra IA analiza el perfil del puesto y el stack del candidato para generar un entorno de simulación dinámico con fallos y tareas que ocurrirían en un día real de trabajo." },
                { q: "¿Qué empresas están contratando?", a: "Trabajamos con startups Tier 1 y empresas tecnológicas consolidadas que valoran la excelencia técnica sobre los títulos académicos." },
                { q: "¿Qué pasa si no paso THE LINE?", a: "No te preocupes. Recibirás un feedback detallado de tus áreas de mejora y podrás volver a intentarlo después de un periodo de enfriamiento para asegurar tu crecimiento." }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-100 py-2">
                  <AccordionTrigger className="text-left font-bold text-base md:text-lg hover:no-underline hover:text-brand-blue transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 font-medium leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 11. Final CTA */}
        <section className="py-24 md:py-40 px-6 bg-gray-950 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto text-center space-y-10 relative z-10">
            <h2 className="text-4xl md:text-7xl font-headline font-black italic tracking-tighter leading-tight">
              Deja de buscar trabajo. <br /> <span className="text-brand-blue">Haz que te encuentren.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-brand-blue text-white h-16 px-12 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-blue/90"
               >
                 Crear Mi Perfil
               </Button>
               <Button 
                variant="outline"
                className="border-white/20 h-16 px-12 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 text-white"
               >
                 Hablar con Ventas
               </Button>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[100vh] border border-white/10 rounded-full animate-pulse" />
          </div>
        </section>

        {/* 12. Footer */}
        <footer className={cn(
          "py-16 md:py-24 px-6 border-t transition-colors duration-1000",
          isDarkMode ? "bg-black border-white/10 text-white" : "bg-white border-gray-100 text-foreground"
        )}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-blue rounded-lg" />
                Nextape
              </div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">Rediseñando el futuro del hiring técnico a través de la validación por IA.</p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-brand-blue/10 hover:text-brand-blue transition-colors">
                   <Users className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-brand-blue/10 hover:text-brand-blue transition-colors">
                   <Target className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plataforma</p>
              <ul className="space-y-3 text-sm font-bold text-gray-500">
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">The LINE</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Ofertas de Empleo</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Empresa</p>
              <ul className="space-y-3 text-sm font-bold text-gray-500">
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Manifiesto</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Contratar Talento</Link></li>
                <li><Link href="#" className="hover:text-brand-blue transition-colors">Blog Tech</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Newsletter</p>
              <p className="text-xs text-gray-400 font-medium">Recibe los mejores desafíos de THE LINE en tu correo.</p>
              <div className="flex gap-2">
                 <input type="email" placeholder="email@nextape.io" className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs flex-1 focus:ring-1 ring-brand-blue outline-none" />
                 <Button className="rounded-xl bg-black text-white px-4 h-10">Ok</Button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <div>© 2024 NEXTAPE INC. TODOS LOS DERECHOS RESERVADOS.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-brand-blue">Privacidad</Link>
              <Link href="#" className="hover:text-brand-blue">Términos</Link>
              <Link href="#" className="hover:text-brand-blue">Cookies</Link>
            </div>
          </div>
        </footer>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
