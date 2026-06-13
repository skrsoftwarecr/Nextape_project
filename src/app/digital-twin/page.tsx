
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DigitalTwinRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirigir a la ruta oficial del Digital Twin (/profile)
    router.replace("/profile");
  }, [router]);

  return null;
}
