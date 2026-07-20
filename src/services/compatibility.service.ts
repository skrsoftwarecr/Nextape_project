
import { getDocById } from "@/lib/firebase/firestore";
import { CompatibilityMatch } from "@/types/job.types";

export const CompatibilityService = {
  getMatch: (uid: string, jobId: string) => getDocById<CompatibilityMatch>("candidate_matches", `${uid}_${jobId}`)
};
