import { useState, useEffect } from "react";
import { CandidateMatch } from "../types/compatibility.types";
import { CompatibilityRepository } from "../repositories/compatibility.repository";
import EngineService from "../services/engine.service";

export const useCompatibility = (userId: string | null, jobId: string | null) => {
    const [match, setMatch] = useState<CandidateMatch | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId || !jobId) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const existing = await CompatibilityRepository.getMatch(userId, jobId);
                if (existing) {
                    setMatch(existing);
                } else {
                    const calculated = await EngineService.calculateMatch(userId, jobId);
                    setMatch(calculated);
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Error calculando compatibilidad";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [userId, jobId]);

    return { match, loading, error };
};