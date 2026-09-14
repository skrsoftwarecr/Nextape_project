import type { DocumentData } from "firebase-admin/firestore";

/**
 * ¿Cuenta como "tiene GitHub" para dimensionar The LINE (10 preguntas en vez de 20)?
 *
 * Hacen falta dos cosas:
 * 1. Evidencia de CÓDIGO analizado (al menos un repositorio con AST). Repositorios sin código en los
 *    lenguajes soportados no aportan señal técnica.
 * 2. Que la cuenta analizada sea la del usuario (`identity.verified`: la vinculó por OAuth). El usuario
 *    de GitHub se escribe a mano; sin esta comprobación, analizar la cuenta de otra persona reducía el
 *    examen a la mitad.
 */
export function hasGithubEvidence(data: DocumentData | undefined): boolean {
  if (!data || data.identity?.verified !== true) return false;
  if (Number(data.reposWithCode ?? 0) > 0) return true;
  return data.skillScores?.hasASTData === true;
}
