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
 * Credenciales: ver `resolveCredential()` justo debajo.
 */

/**
 * Resuelve las credenciales del Admin SDK admitiendo DOS formatos:
 *
 *  A) `FIREBASE_SERVICE_ACCOUNT` — el JSON completo del service account en una variable.
 *  B) `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` — tres variables
 *     simples.
 *
 * El formato B existe porque el A falla con facilidad en los paneles web de hosting: son ~2 400
 * caracteres con `\n` incrustados dentro de la clave privada, y basta con que el panel los
 * convierta en saltos reales, o que alguien lo pegue entre comillas, para que el JSON deje de
 * parsear. El síntoma es un 401 en todos los endpoints, que no se parece en nada a la causa.
 *
 * En el formato B se aceptan los `\n` de la clave privada tanto escapados como reales.
 */
function resolveCredential() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (raw) {
    try {
      return cert(JSON.parse(raw));
    } catch (err) {
      console.error(
        `[admin] FIREBASE_SERVICE_ACCOUNT existe (${raw.length} caracteres) pero NO es JSON ` +
          "válido. Debe ser el JSON COMPLETO, en una sola línea, SIN comillas alrededor y " +
          "conservando los \\n de la clave privada como texto. Alternativa más robusta: usar " +
          "FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY. " +
          `Error del parser: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw err;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      // Los paneles de hosting guardan los saltos como `\n` literales; Firebase necesita saltos
      // reales. Se normaliza aquí para que ambas formas funcionen.
      privateKey: privateKey.replace(/\\n/g, "\n"),
    });
  }

  console.error(
    "[admin] NO hay credenciales del Admin SDK. Define en el hosting UNA de estas dos opciones:\n" +
      "        A) FIREBASE_SERVICE_ACCOUNT = el JSON completo del service account\n" +
      "        B) FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY\n" +
      "        En Netlify, la variable debe tener alcance 'Functions' (no solo 'Builds') y estar\n" +
      "        en el contexto 'Production'. Sin esto TODOS los /api/* responden 401.",
  );
  return applicationDefault();
}

let cachedApp: App | undefined;

function adminApp(): App {
  if (getApps().length) return getApp();
  if (cachedApp) return cachedApp;

  const credential = resolveCredential();
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
    // `true` = comprueba revocación: un token robado o de una cuenta deshabilitada deja de valer
    // al instante, en vez de seguir siendo válido hasta que expire (~1 h).
    const decoded = await adminAuth().verifyIdToken(token, true);
    return decoded.uid;
  } catch (err) {
    // El error se registra SIEMPRE. Antes se descartaba en silencio y el handler respondía 401,
    // así que un servidor sin credenciales era indistinguible de un token inválido: la app decía
    // "unauthorized" a un usuario perfectamente logueado y no había ninguna pista de por qué.
    const message = err instanceof Error ? err.message : String(err);
    if (!isCredentialsConfigured()) {
      console.error(
        "[admin] No se pudo verificar el token porque el Admin SDK NO tiene credenciales.\n" +
          "        Define en el hosting UNA de estas dos opciones:\n" +
          "          A) FIREBASE_SERVICE_ACCOUNT = JSON completo del service account\n" +
          "          B) FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY\n" +
          "        En Netlify: alcance 'Functions' (no solo 'Builds') y contexto 'Production'.\n" +
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
  const hasSplitVars = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT ||
      hasSplitVars ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCLOUD_PROJECT
  );
}
