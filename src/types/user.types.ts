import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  githubUrl: string;
  role: "developer" | "recruiter";
  createdAt: Timestamp;
}

export interface UserSkills {
  uid: string;
  scores: { [skillName: string]: number }; // 0-100
  updatedAt: Timestamp;
}

export interface DigitalTwinData {
  uid: string;
  visitCount: number;
  lastVisit: Timestamp;
  telemetry: Record<string, any>;
}
