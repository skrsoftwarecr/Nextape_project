import { FirestoreTimestamp } from "./firebase.types";

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  postedAt: FirestoreTimestamp;
}

export interface CompatibilityMatch {
  userId: string;
  jobId: string;
  percentage: number;
  breakdown: { [skill: string]: number };
  calculatedAt: FirestoreTimestamp;
}
