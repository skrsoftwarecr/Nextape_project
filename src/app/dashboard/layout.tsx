
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, User, Terminal, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Panel", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "The LINE", icon: Terminal, href: "/dashboard/the-line" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show regular layout for "The LINE" assessment (immersive mode)
  const isLineAssessment = pathname === "/dashboard/the-line" && typeof window !== "undefined" && localStorage.getItem("line_active") === "true";

  if (isLineAssessment) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 fixed top-0 bottom-0 border-r-4 border-black">
        <div className="p-8 border-b-4 border-black">
          <Link href="/" className="text-3xl font-headline font-black tracking-tighter uppercase italic block">
            NEXTAPE<span className="text-secondary">.</span>
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-4 px-4 py-4 font-bold uppercase tracking-widest text-sm transition-all border-2 ${isActive ? "bg-primary text-white border-black translate-x-1 -translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-transparent hover:border-black/10"}`}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t-4 border-black">
          <Button variant="ghost" className="w-full flex justify-start gap-4 font-bold uppercase tracking-widest text-sm p-4 h-auto hover:bg-secondary hover:text-white rounded-none">
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full bg-background border-b-2 border-black z-40 p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline font-black tracking-tighter uppercase italic">
          NEXTAPE<span className="text-secondary">.</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-8 w-8" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 right-0 bottom-0 w-4/5 bg-background border-l-4 border-black p-6 flex flex-col">
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-8 w-8" />
              </button>
            </div>
            <nav className="space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`flex items-center gap-4 p-4 font-bold uppercase tracking-widest text-lg border-2 ${isActive ? "bg-primary text-white border-black" : "border-black"}`}>
                      <item.icon className="h-6 w-6" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto">
              <Button className="w-full bg-secondary text-white font-bold uppercase tracking-widest p-4 h-auto rounded-none">
                <LogOut className="h-5 w-5 mr-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-24 md:pt-0">
        <div className="p-8 md:p-12 max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
