
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Terminal, 
  LogOut, 
  Menu, 
  Fingerprint, 
  Map, 
  Target 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { name: "Panel", icon: LayoutDashboard, href: "/dashboard" },
  { name: "The LINE", icon: Terminal, href: "/line" },
  { name: "Digital Twin", icon: Fingerprint, href: "/digital-twin" },
  { name: "Roadmap", icon: Map, href: "/roadmap" },
  { name: "Jobs", icon: Briefcase, href: "/jobs" },
  { name: "Compatibilidad", icon: Target, href: "/compatibility" },
  { name: "Perfil", icon: User, href: "/profile" },
];

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-body">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 fixed top-0 bottom-0 bg-white/70 backdrop-blur-xl border-r border-gray-200 z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nextape</span>
          </Link>
        </div>
        
        <div className="flex-grow px-4 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="p-6">
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl py-6">
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 z-40 p-4 flex justify-between items-center h-16">
        <Link href="/" className="text-xl font-bold tracking-tight">Nextape</Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 border-none p-0 bg-white">
            <SheetHeader className="p-8 border-b border-gray-50">
              <SheetTitle className="text-left flex items-center gap-2">
                 <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center">
                   <div className="w-3 h-3 bg-white rounded-full" />
                 </div>
                 Nextape
              </SheetTitle>
            </SheetHeader>
            <div className="p-6 overflow-y-auto h-full pb-20">
              <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
              <div className="mt-8 pt-8 border-t border-gray-50">
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl py-6">
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-10 max-w-7xl mx-auto pb-20 md:pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
