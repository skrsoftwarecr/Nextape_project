import { FirestoreTimestamp } from "@/types/firebase.types";

export interface CandidateMatch {
  id: string; // "{userId}_{jobId}"
  userId: string;
  jobId: string;
  totalScore: number;          // 0-100
  skillMatch: number;          // 0-100 → pesa 70%
  evidenceMatch: number;       // 0-100 → pesa 20%
  experienceMatch: number;     // 0-100 → pesa 10%
  breakdown: { [skillKey: string]: number };
  missingSkills: string[];
  calculatedAt: FirestoreTimestamp;
}

export interface GithubEvidence {
  uid: string;
  evidenceScore: number;       // 0-100
  consistencyScore: number;
  diversityScore: number;
  qualitySignals: {
    hasTests: boolean;
    hasDocumentation: boolean;
    hasOpenSource: boolean;
    hasCollaboration: boolean;
  };
  lastUpdated: FirestoreTimestamp;
}
