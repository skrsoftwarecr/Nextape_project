import { JobsRepository } from "../repositories/jobs.repository";
import { JobWithDetails } from "../types/job.types";

export const JobService = {
  /**
   * Retrieves the latest active jobs enriched with company data, required skills, 
   * and optionally the compatibility match score if a user ID is provided.
   */
  getEnrichedJobs: async (uid?: string): Promise<JobWithDetails[]> => {
    try {
      const activeJobs = await JobsRepository.getLatestActiveJobs(20);
      
      const enrichedJobsPromises = activeJobs.map(async (job) => {
        // Fetch company data
        const company = await JobsRepository.getCompanyById(job.companyId);
        if (!company) {
          throw new Error(`Company ${job.companyId} not found for job ${job.id}`);
        }

        // Fetch skills for this job
        const skills = await JobsRepository.getJobSkills(job.id);

        // Fetch match score if user is logged in
        let matchScore: number | undefined = undefined;
        if (uid) {
          matchScore = await JobsRepository.getCandidateMatch(uid, job.id);
        }

        return {
          ...job,
          company,
          skills,
          matchScore
        } as JobWithDetails;
      });

      return await Promise.all(enrichedJobsPromises);
    } catch (error) {
      console.error("Error fetching enriched jobs:", error);
      throw error;
    }
  }
};
