import { getDocById, setDocById } from "@/lib/firebase/firestore";
import { UserProfile } from "@/features/auth/types/user.types";

export const UserService = {
  getUser: (uid: string) => getDocById<UserProfile>("users", uid),
  saveUser: (uid: string, profile: UserProfile) => setDocById("users", uid, profile)
};
