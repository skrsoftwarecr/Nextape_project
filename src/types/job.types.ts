import { Timestamp } from "firebase/firestore";

export interface JobOpportunity {
  jobId: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  requiredSkills: string[];
  postedAt: Timestamp;
}

export interface CompatibilityMatch {
  userId: string;
  jobId: string;
  percentage: number;
  breakdown: { [skill: string]: number };
  calculatedAt: Timestamp;
}
