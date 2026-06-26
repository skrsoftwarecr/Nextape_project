"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Fingerprint, 
  Map, 
  Target,
  Terminal,
  LogOut,
  Menu,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Image from "next/image";

const navItems = [
  { name: "Panel", icon: LayoutDashboard, href: "/dashboard" },
  { name: "The LINE", icon: Terminal, href: "/dashboard/line" },
  { name: "CORE", icon: Fingerprint, href: "/dashboard/core" },
  { name: "Roadmap", icon: Map, href: "/dashboard/roadmap" },
  { name: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
  { name: "Compatibilidad", icon: Target, href: "/dashboard/compatibility" },
  { name: "Perfil", icon: User, href: "/dashboard/profile" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href} onClick={onClick}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" : "text-gray-500 hover:bg-gray-100"}`}>
              <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
              {item.name}
            </div>
          </Link>
        );
      })}
    </nav>
  );

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-body text-foreground">
      <aside className="hidden md:flex flex-col w-72 fixed top-0 bottom-0 bg-white/70 backdrop-blur-xl border-r border-gray-200 z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/models/logo1.jpeg"
              alt="Nextape"
              width={120}
              height={60}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="flex-grow px-4 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="p-6">
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="w-full justify-start gap-3 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-2xl py-6 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      <header className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 z-40 p-4 flex justify-between items-center h-16">
        <Link href="/">
          <Image
            src="/models/logo1.jpeg"
            alt="Nextape"
            width={120}
            height={60}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 border-none p-0 bg-white">
            <SheetHeader className="p-8 border-b border-gray-50">
              <SheetTitle className="text-left">
                <Image
                  src="/models/logo1.jpeg"
                  alt="Nextape"
                  width={120}
                  height={60}
                  className="h-10 w-auto object-contain"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="p-6 overflow-y-auto h-full pb-20">
              <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 md:ml-72 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-10 max-w-7xl mx-auto pb-20 md:pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
