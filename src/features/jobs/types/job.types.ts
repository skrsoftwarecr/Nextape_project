import { Timestamp } from "firebase/firestore";

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  size: 'startup' | 'mid' | 'enterprise';
}

export interface JobSkillRequirement {
  skillId: string;
  skillName: string;
  minScore: number;      // score mínimo requerido (0-100)
  level: 'junior' | 'mid' | 'senior';
  required: boolean;     // true = obligatorio, false = deseable
}

export interface JobOpportunity {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  remote: 'full' | 'hybrid' | 'onsite';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  postedAt: Timestamp;
  active: boolean;
}

export interface JobWithDetails extends JobOpportunity {
  company: Company;
  skills: JobSkillRequirement[];
  matchScore?: number;   // del Compatibility Engine, puede no existir
}

// Previously in compatibility.types.ts, but let's keep it here if it's the standard, 
// or maybe the user just wants the CompatibilityMatch to be available.
// Actually, it's already in compatibility.types.ts, I will remove it from here 
// since the prompt only requested the above interfaces.
