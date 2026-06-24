
import { getDocById } from "@/lib/firebase/firestore";
import { CandidateMatch } from "@/features/compatibility/types/compatibility.types";

export const CompatibilityService = {
  getMatch: (uid: string, jobId: string) => getDocById<CandidateMatch>("compatibility", `${uid}_${jobId}`)
};
