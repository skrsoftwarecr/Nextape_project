import { setDoc, getDoc } from "@/lib/firebase/firestore";
import { AssessmentSession } from "@/types/assessment.types";

export const AssessmentService = {
  startSession: (id: string, data: AssessmentSession) => setDoc("assessments", id, data),
  getSession: (id: string) => getDoc<AssessmentSession>("assessments", id)
};
