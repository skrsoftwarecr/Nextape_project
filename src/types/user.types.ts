import { FirestoreTimestamp } from "./firebase.types";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  githubUrl: string;
  role: "developer" | "recruiter";
  createdAt: FirestoreTimestamp;
}

export interface UserSkills {
  uid: string;
  scores: { [skillName: string]: number };
  updatedAt: FirestoreTimestamp;
}
