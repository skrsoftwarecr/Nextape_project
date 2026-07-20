/**
 * Barrel de tipos canónicos de NEXTAPE.
 *
 * Reexporta los tipos por dominio. Importa siempre desde aquí (`@/types`) o desde
 * el archivo de dominio específico (`@/types/user.types`, etc.).
 *
 * NOTA: este archivo contenía tipos legacy incompatibles (un `UserProfile` con
 * `username`/`grade`/`skills[]`). Se eliminaron al consolidar el modelo de datos.
 * El `UserProfile` canónico vive en `user.types.ts`. Ver docs/DATABASE.md.
 */
export * from "./firebase.types";
export * from "./user.types";
export * from "./assessment.types";
export * from "./job.types";
