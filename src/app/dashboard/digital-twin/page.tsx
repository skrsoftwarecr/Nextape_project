"use client";

import { Fingerprint } from "lucide-react";

export default function DigitalTwinPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-black italic">Digital Twin.</h1>
        <p className="text-gray-500 font-medium">Analítica avanzada de tu representación virtual.</p>
      </header>

      <div className="bg-white p-12 rounded-[3rem] shadow-apple border border-gray-50 flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center">
            <Fingerprint className="h-12 w-12 text-brand-blue" />
         </div>
         <h2 className="text-3xl font-black italic tracking-tighter">Próximamente.</h2>
         <p className="text-gray-400 max-w-sm font-medium">Estamos calibrando el motor de proyección para mostrar visualizaciones 3D de tu DNA técnico en tiempo real.</p>
      </div>
    </div>
  );
}
