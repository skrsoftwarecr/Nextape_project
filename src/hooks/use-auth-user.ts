"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

/**
 * Suscripción estándar al estado de autenticación.
 *
 * Evita el bug recurrente de leer `auth.currentUser` dentro de un `useEffect` antes de que
 * Firebase Auth haya resuelto la sesión (devuelve `null` en el primer render y no vuelve a
 * disparar). Usa este hook y depende de `user` en tus efectos de carga de datos.
 *
 * @returns `user` (o `null`) y `authLoading` mientras Auth resuelve por primera vez.
 */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, authLoading };
}
