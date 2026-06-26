"use client";

import { Fingerprint } from "lucide-react";

export default function CorePage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-black italic">CORE.</h1>
        <p className="text-gray-500 font-medium text-sm">Tu identidad técnica central y motor de proyección digital.</p>
      </header>

      <div className="bg-white p-12 rounded-[3rem] shadow-apple border border-gray-50 flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center">
            <Fingerprint className="h-12 w-12 text-brand-blue" />
         </div>
         <h2 className="text-3xl font-black italic tracking-tighter">Sincronización en curso.</h2>
         <p className="text-gray-400 max-w-sm font-medium">Estamos procesando tu DNA técnico para generar tu representación CORE en 3D.</p>
      </div>
    </div>
  );
}
