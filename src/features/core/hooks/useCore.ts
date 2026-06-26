import { useState, useEffect } from "react";
import { CoreService } from "../services/core.service";
import { UserProfile } from "@/types/index";

export const useCore = (uid: string | undefined) => {
  const [coreData, setCoreData] = useState<UserProfile["core"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchCore = async () => {
      try {
        const data = await CoreService.getCoreIdentity(uid);
        if (data) setCoreData(data.core);
      } catch (error) {
        console.error("Error fetching CORE identity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCore();
  }, [uid]);

  return { coreData, loading };
};
