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
  core: {
    visibility: 'public' | 'private';
    views: number;
    tags: string[];
    telemetry: any;
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
