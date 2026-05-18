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
    <div className="flex flex-col min-h-screen bg-white font-body">
      {/* Navbar - Apple Style */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-xl" />
             Nextape
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Process</button>
            <button className="hidden md:block text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Pricing</button>
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-black text-white hover:bg-gray-800 px-6 py-5 rounded-full text-sm font-bold tracking-tight shadow-apple"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32">
        {/* Hero Section - Refined */}
        <section className="px-6 max-w-7xl mx-auto mb-32 text-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-accent/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Version 2.0 Is Here
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-black leading-[1] tracking-tighter italic">
              Level up <br />
              <span className="text-primary">your code.</span> <br />
              Find your <br />
              <span className="text-secondary">next tape.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed pt-8">
              The premier assessment platform for developers who care about the art of code. Verified by AI. Designed for masters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-white hover:bg-primary/90 h-16 px-10 rounded-full text-lg font-bold shadow-apple-lg"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline"
                className="border-gray-200 h-16 px-10 rounded-full text-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Sections - iOS Style */}
        <section className="py-24 px-6 bg-[#F5F5F7]">
          <div className="max-w-7xl mx-auto space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Verified Technical DNA.</h2>
                <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
                  Stop guessing. Our AI deep-dive analysis gives companies a clear picture of your engineering intuition, not just your memorization.
                </p>
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-400">+500 verified engineers</span>
                </div>
              </div>
              <div className="bg-white rounded-[3rem] p-4 shadow-apple-lg overflow-hidden aspect-video relative">
                <Image 
                  src="https://picsum.photos/seed/nextapehero/1200/800" 
                  alt="Interface" 
                  fill
                  className="object-cover rounded-[2.5rem]"
                  data-ai-hint="clean interface"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
              <div className="order-2 lg:order-1 bg-black rounded-[3rem] p-8 shadow-apple-lg aspect-video relative flex flex-col justify-end overflow-hidden">
                <Image 
                  src="https://picsum.photos/seed/nextapeline/1200/800" 
                  alt="The Line" 
                  fill
                  className="object-cover opacity-60 rounded-[2.5rem]"
                  data-ai-hint="dark code"
                />
                <div className="relative z-10 text-white">
                  <div className="w-12 h-1 bg-primary mb-4" />
                  <p className="text-2xl font-bold italic">Dimension Analysis: Performance</p>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The LINE Experience.</h2>
                <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
                  More than a quiz. It's a cinematic assessment that puts you in high-pressure scenarios to test your real-world decision making.
                </p>
                <Button className="rounded-full px-8 py-6 h-auto bg-black text-white">Learn About The Line</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-24 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <div className="text-2xl font-bold tracking-tighter">Nextape</div>
              <p className="text-gray-400 max-w-xs font-medium">Built for the masters of code. Tokyo & Worldwide.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-600">
                  <li><Link href="#" className="hover:text-primary">Panel</Link></li>
                  <li><Link href="#" className="hover:text-primary">Assessments</Link></li>
                  <li><Link href="#" className="hover:text-primary">Jobs</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-600">
                  <li><Link href="#" className="hover:text-primary">Manifesto</Link></li>
                  <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                  <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Legal</p>
                <ul className="space-y-2 text-sm font-semibold text-gray-600">
                  <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-primary">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-gray-50 text-xs text-gray-400 font-bold uppercase tracking-widest">
            © 2024 NEXTAPE INC. VERIFIED IDENTITY.
          </div>
        </footer>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}