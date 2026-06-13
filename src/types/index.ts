
export type SkillScore = {
  skill: string;
  score: number;
  lastUpdated: string;
  evidence: string[]; // URLs or commit IDs
};

export type UserProfile = {
  uid: string;
  username: string;
  grade: 'S' | 'A+' | 'A' | 'B' | 'C';
  skills: SkillScore[];
  digitalTwin: {
    visibility: 'public' | 'private';
    views: number;
    tags: string[];
  };
};

export type JobOpportunity = {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  stack: string[];
  salary: string;
};
