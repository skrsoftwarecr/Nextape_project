import { getDocById, setDocById, queryCollection } from "@/lib/firebase/firestore";
import { CandidateMatch } from "@/features/compatibility/types/compatibility.types";
import { where, orderBy, limit } from "firebase/firestore";

export const CompatibilityRepository = {
    getMatch: (userId: string, jobId: string) =>
        getDocById<CandidateMatch>("candidate_matches", `${userId}_${jobId}`),

    getMatchesByUser: (userId: string) =>
        queryCollection<CandidateMatch>(
            "candidate_matches",
            where("userId", "==", userId),
            orderBy("totalScore", "desc"),
            limit(20)
        ),
};