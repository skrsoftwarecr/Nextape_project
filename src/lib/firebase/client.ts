'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALMrOQqW8MUX0Ube0HX4HOwDJgWKj_Rtg",
  authDomain: "studio-4462619429-470d8.firebaseapp.com",
  projectId: "studio-4462619429-470d8",
  storageBucket: "studio-4462619429-470d8.firebasestorage.app",
  messagingSenderId: "1098477758552",
  appId: "1:1098477758552:web:99dc337c8c986b4c7fc22d"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };