import { queryCollection } from "@/lib/firebase/firestore";
import { JobOpportunity } from "@/types/job.types";
import { orderBy, limit } from "firebase/firestore";

export const JobService = {
  getLatestJobs: () => queryCollection<JobOpportunity>("jobs", orderBy("postedAt", "desc"), limit(20))
};
