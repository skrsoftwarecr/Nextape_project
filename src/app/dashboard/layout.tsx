
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, User, Terminal, LogOut, Menu } from "lucide-react";
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

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-body">
      {/* Sidebar - Apple Style */}
      <aside className="hidden md:flex flex-col w-72 fixed top-0 bottom-0 bg-white/70 backdrop-blur-xl border-r border-gray-200">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nextape</span>
          </Link>
        </div>
        
        <nav className="flex-grow px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:bg-gray-100"}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl py-6">
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 z-40 p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight">Nextape</Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-full">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pt-20 md:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
