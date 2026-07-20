import { getDocById } from "@/lib/firebase/firestore";
import { UserSkills } from "@/types/user.types";

export const SkillsService = {
  /**
   * Obtiene las habilidades y scores (DNA técnico) de un usuario. Lectura del propio usuario.
   *
   * La ESCRITURA del DNA ocurre EXCLUSIVAMENTE en servidor (POST /api/line/submit, Admin SDK).
   * El cliente no puede escribir `user_skill_scores` (regla `write: if false`) — así el DNA no
   * es falsificable desde el navegador.
   */
  getSkills: (uid: string) => getDocById<UserSkills>("user_skill_scores", uid),
};
