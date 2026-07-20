
import { getDocById, setDocById, queryCollection } from "@/lib/firebase/firestore";
import { UserSkills } from "@/types/user.types";
import { where } from "firebase/firestore";

export const SkillsService = {
  /**
   * Obtiene las habilidades y scores de un usuario.
   */
  getSkills: (uid: string) => getDocById<UserSkills>("user_skill_scores", uid),
  
  /**
   * Actualiza o crea el score de una habilidad.
   */
  updateSkillScore: async (uid: string, skill: string, score: number) => {
    const current = await SkillsService.getSkills(uid);
    const newScores = { ...current?.scores, [skill.toLowerCase()]: score };
    return setDocById("user_skill_scores", uid, {
      uid,
      scores: newScores,
      updatedAt: new Date() as any
    });
  }
};
