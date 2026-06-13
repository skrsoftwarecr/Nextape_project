import { getDoc, setDoc } from "@/lib/firebase/firestore";
import { UserProfile } from "@/types/user.types";

export const UserService = {
  getUser: (uid: string) => getDoc<UserProfile>("users", uid),
  saveUser: (uid: string, profile: UserProfile) => setDoc("users", uid, profile)
};
