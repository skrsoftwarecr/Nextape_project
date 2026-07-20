import { FirestoreTimestamp } from "./firebase.types";

export interface Question {
  id: string;
  briefing: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  tag: string;
}

export interface JobOpportunity {
  id?: string;
  title: string;
  company: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  level: string;
  requiredSkills: string[];
  assessmentQuestions?: Question[];
  createdBy: string;
  postedAt: FirestoreTimestamp;
  applicantsCount?: number;
}

export interface CompatibilityMatch {
  userId: string;
  jobId: string;
  percentage: number;
  breakdown: { [skill: string]: number };
  calculatedAt: FirestoreTimestamp;
}
