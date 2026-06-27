import { Timestamp } from "firebase/firestore";

export type QuestionOption = 'bad' | 'acceptable' | 'excellent';

export const OPTION_SCORES: Record<QuestionOption, number> = {
  bad: 0,
  acceptable: 50,
  excellent: 100
};

export interface Question {
  id: string;
  skillId: string;
  scenario: string;         // descripción del escenario real
  options: {
    bad: string;
    acceptable: string;
    excellent: string;
  };
  approved: boolean;
  createdAt: Timestamp;
}

export interface AssessmentAttempt {
  id: string;
  uid: string; // Firebase Auth UID
  skillId: string;
  answers: Record<string, QuestionOption>; // questionId → opción elegida
  score: number;            // 0-100, calculado al finalizar
  completedAt: Timestamp;
  approved: boolean;        // true cuando score calculado correctamente
  usedForScore?: boolean;   // From existing code, indicates if it's one of the last 3
  difficulty?: "junior" | "mid" | "senior"; // From existing code
}

export interface AssessmentSession {
  id?: string;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, QuestionOption>;
  skillId: string;
  startedAt: Date;
}
