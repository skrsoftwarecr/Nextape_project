import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyRequestUid } from "@/lib/firebase/admin";

export const runtime = "nodejs";

/**
 * GET /api/line/catalog
 * Devuelve qué combinaciones (tecnología/especialidad × nivel) tienen repertorio precargado.
 *
 * Existe porque el selector de The LINE mostraba las 55 tecnologías del catálogo, pero solo las
 * precargadas funcionan: elegir cualquier otra devolvía 503 y el usuario lo vivía como "The LINE
 * está roto". Ofrecer una opción que no funciona es peor que no ofrecerla.
 *
 * Solo lee metadatos (clave, nivel, número de preguntas). **Nunca** devuelve preguntas: el
 * repertorio contiene las claves de respuesta y es server-only.
 */
export async function GET(req: NextRequest) {
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const snap = await adminDb().collection("line_question_pools").get();

    /** subject → niveles disponibles */
    const available: Record<string, string[]> = {};
    snap.forEach((doc) => {
      const data = doc.data();
      const count = data.count ?? (Array.isArray(data.questions) ? data.questions.length : 0);
      if (count <= 0) return; // un repertorio vacío no sirve para examinar

      const level = String(data.level ?? doc.id.split("_").pop() ?? "");
      const subject = String(data.key ?? doc.id.replace(new RegExp(`_${level}$`), ""));
      if (!subject || !level) return;

      available[subject] = [...(available[subject] ?? []), level];
    });

    return NextResponse.json({ available });
  } catch (err) {
    console.error("[line/catalog] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
