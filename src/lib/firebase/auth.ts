'use client';

import { 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  linkWithPopup,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./client";

export const signOut = () => firebaseSignOut(auth);
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const signInWithGithub = () => signInWithPopup(auth, new GithubAuthProvider());

/**
 * Vincula GitHub a la cuenta con sesión iniciada. Es lo que permite al servidor comprobar que la cuenta
 * de GitHub analizada es del usuario (`identity.verified`). Si ya estaba vinculada no abre popup.
 * Devuelve el usuario de GitHub cuando Firebase lo informa.
 */
export async function linkGithubAccount(): Promise<{ username: string | null; alreadyLinked: boolean }> {
  const user = auth.currentUser;
  if (!user) throw new Error("unauthenticated");
  if (user.providerData.some((p) => p.providerId === "github.com")) {
    return { username: null, alreadyLinked: true };
  }
  const credential = await linkWithPopup(user, new GithubAuthProvider());
  return { username: getAdditionalUserInfo(credential)?.username ?? null, alreadyLinked: false };
}

export { signInWithEmailAndPassword, createUserWithEmailAndPassword };

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
