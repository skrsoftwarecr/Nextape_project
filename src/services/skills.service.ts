import { getDoc, setDoc } from "@/lib/firebase/firestore";
import { UserSkills } from "@/types/user.types";

export const SkillsService = {
  getSkills: (uid: string) => getDoc<UserSkills>("skills", uid),
  updateSkills: (uid: string, skills: Partial<UserSkills>) => setDoc("skills", uid, skills)
};
