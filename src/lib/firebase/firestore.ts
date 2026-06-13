import { 
  doc, 
  getDoc as firestoreGetDoc, 
  setDoc as firestoreSetDoc, 
  updateDoc as firestoreUpdateDoc, 
  collection, 
  query, 
  getDocs, 
  QueryConstraint 
} from "firebase/firestore";
import { db } from "./client";

export const getDocById = async <T>(collectionName: string, id: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await firestoreGetDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
};

export const setDocById = async <T extends object>(collectionName: string, id: string, data: T): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await firestoreSetDoc(docRef, data, { merge: true });
};

export const updateDocById = async <T extends object>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await firestoreUpdateDoc(docRef, data as any);
};

export const queryCollection = async <T>(collectionName: string, ...constraints: QueryConstraint[]): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};
