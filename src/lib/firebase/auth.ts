'use client';

import { 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./client";

export const signOut = () => firebaseSignOut(auth);
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const signInWithGithub = () => signInWithPopup(auth, new GithubAuthProvider());

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
