import { db } from "@/lib/firebase/client";
import { collection, doc, query, where, orderBy, limit, getDocs, getDoc } from "firebase/firestore";
import { JobOpportunity, Company, JobSkillRequirement } from "../types/job.types";

export const JobsRepository = {
  getLatestActiveJobs: async (limitCount: number = 20): Promise<JobOpportunity[]> => {
    try {
      const q = query(
        collection(db, "jobs"),
        where("active", "==", true),
        orderBy("postedAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobOpportunity));
    } catch (error) {
      console.error("Error fetching active jobs:", error);
      throw error;
    }
  },

  getCompanyById: async (companyId: string): Promise<Company | null> => {
    try {
      const docRef = doc(db, "companies", companyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Company;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching company ${companyId}:`, error);
      throw error;
    }
  },

  getJobSkills: async (jobId: string): Promise<JobSkillRequirement[]> => {
    try {
      const q = query(
        collection(db, "job_skills"),
        where("jobId", "==", jobId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          skillId: data.skillId,
          skillName: data.skillName,
          minScore: data.minScore,
          level: data.level,
          required: data.required
        } as JobSkillRequirement;
      });
    } catch (error) {
      console.error(`Error fetching skills for job ${jobId}:`, error);
      throw error;
    }
  },

  getCandidateMatch: async (uid: string, jobId: string): Promise<number | undefined> => {
    try {
      const matchRef = doc(db, "candidate_matches", `${uid}_${jobId}`);
      const matchSnap = await getDoc(matchRef);
      if (matchSnap.exists()) {
        const data = matchSnap.data();
        return data.percentage; // Assuming match logic stores it as "percentage"
      }
      return undefined;
    } catch (error) {
      console.error(`Error fetching match for ${uid} and ${jobId}:`, error);
      throw error;
    }
  }
};
