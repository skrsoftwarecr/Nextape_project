import { 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { auth } from "./client";

export const signOut = () => firebaseSignOut(auth);

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
