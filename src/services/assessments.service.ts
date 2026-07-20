
import { setDocById, getDocById } from "@/lib/firebase/firestore";
import { AssessmentSession } from "@/types/assessment.types";

export const AssessmentService = {
  startSession: (id: string, data: AssessmentSession) => setDocById("assessment_attempts", id, data),
  getSession: (id: string) => getDocById<AssessmentSession>("assessment_attempts", id)
};
