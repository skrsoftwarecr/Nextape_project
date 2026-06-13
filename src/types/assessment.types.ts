import { Timestamp } from "firebase/firestore";

export interface AssessmentSession {
  assessmentId: string;
  userId: string;
  status: "pending" | "in_progress" | "completed";
  answers: { [questionId: string]: string };
  score: number;
  startedAt: Timestamp;
  completedAt?: Timestamp;
}
