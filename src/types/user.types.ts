import { FirestoreTimestamp } from "./firebase.types";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  githubUrl?: string;
  role: "developer" | "recruiter";
  experience?: "junior" | "mid" | "senior";
  seniority?: "junior" | "mid" | "senior";
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export interface UserSkills {
  uid: string;
  scores: { [skillName: string]: number };
  updatedAt: FirestoreTimestamp;
}

export interface UserSkillScores {
  uid: string;
  scores: {
    [skillKey: string]: {
      junior?: number;
      mid?: number;
      senior?: number;
    };
  };
  lastUpdated: FirestoreTimestamp;
  totalAssessments: number;
}

