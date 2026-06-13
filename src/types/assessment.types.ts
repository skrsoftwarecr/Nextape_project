import { Timestamp } from "firebase/firestore";

export interface Question {
  id: string;
  briefing: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'junior' | 'mid' | 'senior' | 'master';
  tag: string;
}

export interface AssessmentSession {
  assessmentId: string;
  userId: string;
  status: "pending" | "in_progress" | "completed";
  answers: { [questionId: string]: string };
  score: number;
  startedAt: Timestamp;
  completedAt?: Timestamp;
}
