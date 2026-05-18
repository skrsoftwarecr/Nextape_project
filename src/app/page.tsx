
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b-2 border-black py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
          <div className="text-3xl font-headline font-black tracking-tighter uppercase italic">
            NEXTAPE<span className="text-secondary">.</span>
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block uppercase font-bold text-sm tracking-widest hover:text-primary">The Process</button>
            <button className="hidden md:block uppercase font-bold text-sm tracking-widest hover:text-primary">Pricing</button>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-black text-white hover:bg-black/90 px-8 py-6 text-sm font-bold uppercase tracking-widest rounded-none border-b-4 border-r-4 border-secondary active:translate-y-1 active:border-b-0 active:border-r-0"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="px-6 max-w-[1440px] mx-auto mb-32">
          <div className="flex flex-col gap-8">
            <div className="text-[12vw] md:text-[10vw] font-headline font-black leading-[0.85] tracking-tighter uppercase italic">
              Level up <br />
              <span className="text-primary">your code.</span> <br />
              Find your <br />
              <span className="text-secondary">next tape.</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mt-12 border-t-4 border-black pt-12">
              <p className="text-2xl md:text-4xl max-w-3xl font-medium leading-tight">
                THE PREMIER ASSESSMENT PLATFORM FOR DEVELOPERS WHO CARE ABOUT THE ART OF CODE. NO FLUFF. JUST THE LINE.
              </p>
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-secondary text-white hover:bg-secondary/90 h-20 px-12 text-2xl font-bold uppercase tracking-widest rounded-none border-b-8 border-r-8 border-black active:translate-y-1 active:border-b-0 active:border-r-0 shrink-0"
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>

        {/* Value Props Section - Asymmetric Layout */}
        <section className="bg-black text-white py-32 px-6">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <span className="hero-number absolute -top-16 -left-8 text-white">01</span>
              <h2 className="text-6xl md:text-8xl font-headline font-black uppercase mb-8 relative z-10 italic">
                Verified <br /> Skillset.
              </h2>
              <p className="text-xl md:text-2xl opacity-80 leading-relaxed max-w-lg">
                Stop guessing. Our AI-driven assessments provide a deep-dive analysis of your technical DNA. We verify your skills so companies don't have to.
              </p>
            </div>
            <div className="border-4 border-white p-4 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="bg-white/10 aspect-video flex items-center justify-center relative overflow-hidden">
                <Image 
                  src="https://picsum.photos/seed/nextapehero/800/600" 
                  alt="Minimal workspace" 
                  fill
                  className="object-cover"
                  data-ai-hint="minimal workspace"
                />
               </div>
            </div>
          </div>

          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center mt-48">
             <div className="order-2 md:order-1 border-4 border-white p-4 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="bg-white/10 aspect-video flex items-center justify-center relative overflow-hidden">
                <Image 
                  src="https://picsum.photos/seed/nextapeline/800/600" 
                  alt="Code line" 
                  fill
                  className="object-cover"
                  data-ai-hint="abstract lines"
                />
               </div>
            </div>
            <div className="relative order-1 md:order-2 md:pl-24">
              <span className="hero-number absolute -top-16 -left-8 md:left-12 text-white">02</span>
              <h2 className="text-6xl md:text-8xl font-headline font-black uppercase mb-8 relative z-10 italic">
                The <br /> Line.
              </h2>
              <p className="text-xl md:text-2xl opacity-80 leading-relaxed max-w-lg">
                The ultimate testing ground. A cinematic assessment experience designed to separate the hobbyists from the masters. Enter the LINE if you dare.
              </p>
            </div>
          </div>

          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center mt-48">
            <div className="relative">
              <span className="hero-number absolute -top-16 -left-8 text-white">03</span>
              <h2 className="text-6xl md:text-8xl font-headline font-black uppercase mb-8 relative z-10 italic">
                Perfect <br /> Match.
              </h2>
              <p className="text-xl md:text-2xl opacity-80 leading-relaxed max-w-lg">
                Our compatibility engine doesn't just look at keywords. It looks at the soul of the position and your specific coding style.
              </p>
            </div>
             <div className="bg-accent h-64 md:h-96 w-full md:w-4/5 ml-auto border-4 border-white"></div>
          </div>
        </section>

        {/* Why NEXTAPE */}
        <section className="py-32 px-6 max-w-[1440px] mx-auto">
          <h2 className="text-8xl font-headline font-black uppercase mb-24 tracking-tighter italic">Why NEXTAPE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "No Biometric Data", desc: "We care about your code, not your face. We don't store any biometric information." },
              { title: "Sony Style", desc: "Inspired by the golden era of hardware. Pure, functional, and aesthetically superior." },
              { title: "Instant Feedback", desc: "Know your score the moment you finish. Detailed breakdowns across 12 dimensions." }
            ].map((item, idx) => (
              <div key={idx} className="border-4 border-black p-12 hover:bg-accent transition-colors group">
                <h3 className="text-4xl font-headline font-black uppercase mb-6">{item.title}</h3>
                <p className="text-xl font-medium leading-relaxed opacity-80 group-hover:opacity-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us */}
        <section className="py-32 px-6 border-t-4 border-black">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-24">
            <div className="md:w-1/3">
              <h2 className="text-6xl font-headline font-black uppercase italic leading-none">About <br /> Us.</h2>
            </div>
            <div className="md:w-2/3 space-y-8">
              <p className="text-3xl font-medium leading-relaxed">
                NEXTAPE was born from the frustration of generic whiteboard interviews and irrelevant assessments. We believe developer hiring should be as rigorous and beautiful as the software we build.
              </p>
              <p className="text-xl opacity-70 max-w-2xl">
                Founded by engineers for engineers, we've built a platform that respects the craft. We leverage high-performance AI to analyze technical prowess in a way that is fair, deep, and final.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-24 px-6 mt-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
            <div className="text-6xl font-headline font-black tracking-tighter uppercase italic">
              NEXTAPE<span className="text-secondary">.</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="flex flex-col gap-4">
                <span className="uppercase text-xs font-bold tracking-widest opacity-50">Platform</span>
                <Link href="#" className="font-bold hover:text-primary">Dashboard</Link>
                <Link href="#" className="font-bold hover:text-primary">Jobs</Link>
                <Link href="#" className="font-bold hover:text-primary">Assessments</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="uppercase text-xs font-bold tracking-widest opacity-50">Company</span>
                <Link href="#" className="font-bold hover:text-primary">About</Link>
                <Link href="#" className="font-bold hover:text-primary">Careers</Link>
                <Link href="#" className="font-bold hover:text-primary">Blog</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="uppercase text-xs font-bold tracking-widest opacity-50">Support</span>
                <Link href="#" className="font-bold hover:text-primary">Help Center</Link>
                <Link href="#" className="font-bold hover:text-primary">Privacy</Link>
                <Link href="#" className="font-bold hover:text-primary">Terms</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="uppercase text-xs font-bold tracking-widest opacity-50">Social</span>
                <Link href="#" className="font-bold hover:text-primary">X (Twitter)</Link>
                <Link href="#" className="font-bold hover:text-primary">GitHub</Link>
                <Link href="#" className="font-bold hover:text-primary">LinkedIn</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-12 flex flex-col md:flex-row justify-between gap-6 opacity-50 font-bold uppercase text-sm tracking-widest">
            <span>© 2024 NEXTAPE Inc. Built for the masters.</span>
            <div className="flex gap-8">
              <span>Contact: hello@nextape.io</span>
              <span>Made in Tokyo</span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
