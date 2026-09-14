/**
 * Claves compartidas de la evidencia de GitHub (server-only).
 */

/**
 * Versión del motor que produjo una evidencia. Subirla invalida la caché por repositorio: la 2.0.0
 * introduce el análisis de TODOS los repositorios y la selección de archivos entre lenguajes, así que
 * los resultados de la 1.x (un repo, 8 archivos) no son comparables.
 */
export const GITHUB_ENGINE_VERSION = "2.0.0";

/** Nombre de usuario de GitHub válido (alfanumérico y guiones, sin guion inicial/final, ≤ 39). */
export const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

/**
 * Nombre de repositorio válido en GitHub. Se valida antes de interpolarlo en URLs de la API con el
 * token del servidor: sin esto, un nombre como ".." normaliza la URL a otro endpoint.
 */
export const GITHUB_REPO_NAME_PATTERN = /^(?!\.{1,2}$)[A-Za-z0-9._-]{1,100}$/;

/**
 * Repositorios por análisis: los de push más reciente. Cubre a casi cualquier persona y acota lo que
 * un solo usuario puede gastar del `GITHUB_TOKEN` compartido (~5 peticiones por repositorio).
 */
export const MAX_REPOS_PER_ANALYSIS = 100;

/** Id de documento de un repositorio: los ids de Firestore no admiten "/". */
export function repoDocId(fullName: string): string {
  return fullName.trim().toLowerCase().replace(/\//g, "__");
}
