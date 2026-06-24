import { db } from "@/lib/firebase/client";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  QueryConstraint
} from "firebase/firestore";
import { CandidateMatch, GithubEvidence } from "@/features/compatibility/types/compatibility.types";
import { UserSkillScores, UserProfile } from "@/features/auth/types/user.types";

export const EngineService = {
  /**
   * Calculates the compatibility match between a candidate and a job opportunity,
   * then saves/caches the result in the candidate_matches collection.
   */
  calculateMatch: async (userId: string, jobId: string): Promise<CandidateMatch> => {
    try {
      // 1. Fetch Job
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      if (!jobSnap.exists()) {
        throw new Error(`Job with ID ${jobId} not found`);
      }
      const jobData = jobSnap.data();

      // 2. Fetch Job Skills (job_skills)
      const jobSkillsCol = collection(db, "job_skills");
      const jobSkillsQuery = query(jobSkillsCol, where("jobId", "==", jobId));
      const jobSkillsSnap = await getDocs(jobSkillsQuery);
      const jobSkills = jobSkillsSnap.docs.map(d => d.data());

      // 3. Fetch User Skill Scores (user_skill_scores)
      const userSkillScoresRef = doc(db, "user_skill_scores", userId);
      const userSkillScoresSnap = await getDoc(userSkillScoresRef);
      const userSkillScores = userSkillScoresSnap.exists()
        ? (userSkillScoresSnap.data() as UserSkillScores)
        : null;

      // 4. Fetch GitHub Evidence (github_evidence)
      const githubEvidenceRef = doc(db, "github_evidence", userId);
      const githubEvidenceSnap = await getDoc(githubEvidenceRef);
      const githubEvidence = githubEvidenceSnap.exists()
        ? (githubEvidenceSnap.data() as GithubEvidence)
        : null;

      // 5. Fetch User Profile for seniority/experience
      const userProfileRef = doc(db, "users", userId);
      const userProfileSnap = await getDoc(userProfileRef);
      const userProfile = userProfileSnap.exists()
        ? (userProfileSnap.data() as UserProfile)
        : null;

      // --- Match Calculation ---

      // A. Evidence Match (20% weight)
      const evidenceMatch = githubEvidence?.evidenceScore ?? 0;

      // B. Experience Match (10% weight)
      const devSeniority = userProfile?.experience || userProfile?.seniority;
      const jobSeniority = jobData.seniority;

      const seniorityMap: Record<string, number> = { junior: 1, mid: 2, senior: 3 };
      const devVal = devSeniority ? (seniorityMap[devSeniority.toLowerCase()] || 1) : 1;
      const jobVal = jobSeniority ? (seniorityMap[jobSeniority.toLowerCase()] || 1) : 1;

      let experienceMatch = 0;
      if (devVal >= jobVal) {
        experienceMatch = 100;
      } else if (devVal === jobVal - 1) {
        experienceMatch = 50;
      } else {
        experienceMatch = 0;
      }

      // C. Skill Match (70% weight)
      let skillMatch = 0;
      const breakdown: { [skillKey: string]: number } = {};
      const missingSkills: string[] = [];

      if (jobSkills.length > 0) {
        let skillMatchSum = 0;

        for (const jobSkill of jobSkills) {
          const skillKey = jobSkill.skillKey;
          const requiredLevel = jobSkill.requiredLevel as "junior" | "mid" | "senior";
          const minScore = jobSkill.minScore;
          const weight = jobSkill.weight;

          // Get user score for this skill and difficulty level
          const userScore = userSkillScores?.scores?.[skillKey]?.[requiredLevel] ?? 0;

          // Compute individual ratio: min(userScore / minScore, 1)
          let ratio = 1;
          if (minScore > 0) {
            ratio = Math.min(userScore / minScore, 1);
          }

          skillMatchSum += ratio * weight;

          // Breakdown: save the actual developer score for the skill
          breakdown[skillKey] = userScore;

          // Track missing skills (where score is insufficient)
          if (userScore < minScore) {
            missingSkills.push(skillKey);
          }
        }

        skillMatch = skillMatchSum * 100;
      } else {
        // If no required skills are defined, default skillMatch to 100%
        skillMatch = 100;
      }

      // D. Total Score Formula
      const roundedSkillMatch = Math.round(skillMatch * 100) / 100;
      const totalScore = (roundedSkillMatch * 0.70) + (evidenceMatch * 0.20) + (experienceMatch * 0.10);
      const roundedTotalScore = Math.round(totalScore * 100) / 100;

      // 6. Save Match Record in candidate_matches/{userId}_{jobId}
      const matchId = `${userId}_${jobId}`;
      const matchDocRef = doc(db, "candidate_matches", matchId);
      
      const newMatch: Omit<CandidateMatch, "calculatedAt"> & { calculatedAt: any } = {
        id: matchId,
        userId,
        jobId,
        totalScore: roundedTotalScore,
        skillMatch: roundedSkillMatch,
        evidenceMatch,
        experienceMatch,
        breakdown,
        missingSkills,
        calculatedAt: serverTimestamp()
      };

      await setDoc(matchDocRef, newMatch);

      return {
        ...newMatch,
        calculatedAt: serverTimestamp() as any
      } as CandidateMatch;
    } catch (error) {
      console.error(`Error calculating match for user ${userId} and job ${jobId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves matches for a developer ordered by totalScore DESC.
   */
  getMatchesByUser: async (userId: string, limitCount?: number): Promise<CandidateMatch[]> => {
    try {
      const matchesCol = collection(db, "candidate_matches");
      const constraints: QueryConstraint[] = [
        where("userId", "==", userId),
        orderBy("totalScore", "desc")
      ];

      if (limitCount !== undefined) {
        constraints.push(limit(limitCount));
      }

      const q = query(matchesCol, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(d => d.data() as CandidateMatch);
    } catch (error) {
      console.error(`Error retrieving matches for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves ranking of candidates for a specific job vacancy ordered by totalScore DESC.
   */
  getCandidatesForJob: async (jobId: string, limitCount?: number): Promise<CandidateMatch[]> => {
    try {
      const matchesCol = collection(db, "candidate_matches");
      const constraints: QueryConstraint[] = [
        where("jobId", "==", jobId),
        orderBy("totalScore", "desc")
      ];

      if (limitCount !== undefined) {
        constraints.push(limit(limitCount));
      }

      const q = query(matchesCol, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(d => d.data() as CandidateMatch);
    } catch (error) {
      console.error(`Error retrieving candidates for job ${jobId}:`, error);
      throw error;
    }
  },

  /**
   * Recalculates all compatibility matches for a user against all active jobs.
   * Triggered when user_skill_scores changes.
   */
  recalculateUserMatches: async (userId: string): Promise<void> => {
    try {
      const jobsCol = collection(db, "jobs");
      const q = query(jobsCol, where("status", "==", "active"));
      const querySnapshot = await getDocs(q);

      const activeJobIds = querySnapshot.docs.map(d => d.id);

      await Promise.all(
        activeJobIds.map(jobId => EngineService.calculateMatch(userId, jobId))
      );
    } catch (error) {
      console.error(`Error recalculating matches for user ${userId}:`, error);
      throw error;
    }
  }
};

export default EngineService;
