import { useState, useEffect } from "react";
import { getIllnessByIdUseCase } from "~/infrastructure/di/container";
import { Illness } from "~/domain/entities/Illness";

export function useGetIllnessById(illnessId?: number) {
  const [illness, setIllness] = useState<Illness | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!illnessId) {
      setError("No illness ID provided");
      setLoading(false);
      return;
    }
    const fetchillness = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getIllnessByIdUseCase.execute(illnessId);
        if (data) {
          setIllness(data);
        } else {
          setError("No data found for this illness ID.");
        }
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
    fetchillness();
  }, [illnessId]);
  return { illness, loading, error };
}
