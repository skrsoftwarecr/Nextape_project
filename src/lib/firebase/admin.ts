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

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  // Diagnóstico de arranque. Un fallo de credenciales aquí se manifiesta como 401 en todos los
  // endpoints, así que sin esto es indistinguible de un problema de sesión del usuario.
  // NUNCA se registra el contenido de la clave: solo si existe y si es JSON válido.
  if (!raw) {
    console.error(
      "[admin] FIREBASE_SERVICE_ACCOUNT no está definida. Se intentará usar credenciales por " +
        "defecto (ADC), que NO existen en Netlify. Todos los /api/* responderán 401.",
    );
  }

  let credential;
  if (raw) {
    try {
      credential = cert(JSON.parse(raw));
    } catch (err) {
      // Causa habitual en Netlify: el JSON se pegó con comillas envolventes, o el panel
      // transformó los `\n` de la clave privada en saltos de línea reales, que rompen el JSON.
      // Sin este mensaje el síntoma es un 401 idéntico al de "variable ausente".
      console.error(
        `[admin] FIREBASE_SERVICE_ACCOUNT existe (${raw.length} caracteres) pero NO es JSON ` +
          "válido. Debe ser el JSON del service account COMPLETO, en una sola línea y SIN " +
          "comillas alrededor, conservando los \\n de la clave privada como texto. " +
          `Error del parser: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw err;
    }
  } else {
    credential = applicationDefault();
  }

  cachedApp = initializeApp({ credential });
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
  } catch (err) {
    // El error se registra SIEMPRE. Antes se descartaba en silencio y el handler respondía 401,
    // así que un servidor sin credenciales era indistinguible de un token inválido: la app decía
    // "unauthorized" a un usuario perfectamente logueado y no había ninguna pista de por qué.
    const message = err instanceof Error ? err.message : String(err);
    if (!isCredentialsConfigured()) {
      console.error(
        "[admin] No se pudo verificar el token porque el Admin SDK NO tiene credenciales.\n" +
          "        Define FIREBASE_SERVICE_ACCOUNT (JSON del service account) o\n" +
          "        GOOGLE_APPLICATION_CREDENTIALS (ruta al JSON) en .env.local y reinicia el server.\n" +
          `        Error original: ${message}`
      );
    } else {
      console.warn("[admin] Token rechazado:", message);
    }
    return null;
  }
}

/** ¿Hay alguna credencial de servidor disponible para el Admin SDK? */
function isCredentialsConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCLOUD_PROJECT
  );
}
