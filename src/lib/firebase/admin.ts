import {
  initializeApp,
  getApps,
  getApp,
  cert,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

/**
 * Firebase Admin SDK — SOLO servidor (route handlers en `src/app/api/*`).
 *
 * Bypassa las reglas de seguridad, por eso toda escritura de datos "de confianza"
 * (scores/DNA, intentos, claves de respuestas) debe pasar por aquí y nunca por el
 * Web SDK del cliente. La inicialización es perezosa para no ejecutarse en build.
 *
 * Credenciales:
 * - En Firebase App Hosting / Google Cloud usa Application Default Credentials (ADC).
 * - En local, define `FIREBASE_SERVICE_ACCOUNT` (JSON del service account en una sola
 *   variable) o `GOOGLE_APPLICATION_CREDENTIALS` (ruta al JSON). Ver `.env.example`.
 */
let cachedApp: App | undefined;

function adminApp(): App {
  if (getApps().length) return getApp();
  if (cachedApp) return cachedApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  cachedApp = initializeApp(
    serviceAccountJson
      ? { credential: cert(JSON.parse(serviceAccountJson)) }
      : { credential: applicationDefault() }
  );
  return cachedApp;
}

export const adminDb = (): Firestore => getFirestore(adminApp());
export const adminAuth = (): Auth => getAuth(adminApp());

/**
 * Verifica el ID token de Firebase que envía el cliente (header `Authorization: Bearer`).
 * Devuelve el `uid` autenticado o `null` si el token falta o es inválido.
 */
export async function verifyRequestUid(authorizationHeader: string | null): Promise<string | null> {
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice(7)
    : null;
  if (!token) return null;
  try {
    const decoded = await adminAuth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}
