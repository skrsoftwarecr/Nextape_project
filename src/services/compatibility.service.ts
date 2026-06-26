import { getDoc } from "@/lib/firebase/firestore";
import { CompatibilityMatch } from "@/types/job.types";

export const CompatibilityService = {
  getMatch: (uid: string, jobId: string) => getDoc<CompatibilityMatch>("compatibility", `${uid}_${jobId}`)
};
