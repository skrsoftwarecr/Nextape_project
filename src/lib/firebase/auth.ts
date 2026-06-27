'use client';
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./client";

export const signOut = () => firebaseSignOut(auth);
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const signInWithGithub = () => signInWithPopup(auth, new GithubAuthProvider());
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const createUserWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const subscribeToAuth = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);