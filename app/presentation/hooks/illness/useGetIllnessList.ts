import { useState, useEffect } from "react";
import { getIllnessListUseCase } from "~/infrastructure/di/container";
import { Illness } from "~/domain/entities/Illness";

export function useGetIllnessList() {
  const [illnesses, setIllnesses] = useState<Illness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIllnesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getIllnessListUseCase.execute();
        setIllnesses(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load illness data";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIllnesses();
  }, []);
  return { illnesses, loading, error };
}
