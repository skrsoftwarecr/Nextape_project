import { FirestoreTimestamp } from "./firebase.types";

export interface AssessmentSession {
  assessmentId: string;
  userId: string;
  status: "pending" | "in_progress" | "completed";
  answers: { [questionId: string]: string };
  score: number;
  startedAt: FirestoreTimestamp;
  completedAt?: FirestoreTimestamp;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: string;
  skill: string;
  difficulty: "junior" | "mid" | "senior";
  score: number;
  completedAt: FirestoreTimestamp;
  usedForScore: boolean;
}

