import { useState, useEffect } from "react";
import { subscribeToAuth } from "@/lib/firebase/auth";
import { User } from "firebase/auth";
import { JobWithDetails } from "../types/job.types";
import { JobService } from "../services/jobs.service";

export const useJobs = () => {
  const [jobs, setJobs] = useState<JobWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobWithDetails | null>(null);

  useEffect(() => {
    // Escuchamos el estado del auth para poder cargar los scores de match si el usuario existe
    const unsubscribe = subscribeToAuth((user: User | null) => {
      const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
          // Si hay usuario, pasamos el uid para que traiga el matchScore
          const enrichedJobs = await JobService.getEnrichedJobs(user?.uid);
          setJobs(enrichedJobs);
          
          // Si había un trabajo seleccionado, lo actualizamos con los nuevos datos (ej. matchScore)
          if (selectedJob) {
            const updatedSelection = enrichedJobs.find(j => j.id === selectedJob.id);
            if (updatedSelection) setSelectedJob(updatedSelection);
          }
        } catch (err: any) {
          setError(err.message || "Error al cargar las vacantes");
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    });

    return () => unsubscribe();
  }, []);

  const selectJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    setSelectedJob(job || null);
  };

  const clearSelection = () => {
    setSelectedJob(null);
  };

  return {
    jobs,
    loading,
    error,
    selectedJob,
    selectJob,
    clearSelection
  };
};
