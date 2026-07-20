"use client";

import { auth } from "@/lib/firebase/client";

/**
 * POST autenticado a los route handlers de NEXTAPE (`/api/*`).
 * Adjunta el Firebase ID token del usuario actual como `Authorization: Bearer` para que el
 * servidor pueda verificar la identidad con el Admin SDK. Lanza `Error` con el código del
 * servidor si la respuesta no es 2xx.
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `request_failed_${res.status}`);
  }
  return res.json() as Promise<T>;
}
