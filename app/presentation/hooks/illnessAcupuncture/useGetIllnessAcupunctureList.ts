import { useState, useEffect } from "react";
import { getIllnessAcupunctureListUseCase } from "~/infrastructure/di/container";
import { IllnessAcupuncture } from "~/domain/entities/IllnessAcupuncture";

export function useGetIllnessAcupunctureList() {
  const [illnessAcupunctures, setIllnessAcupunctures] = useState<IllnessAcupuncture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIllnessAcupunctures = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getIllnessAcupunctureListUseCase.execute();
        setIllnessAcupunctures(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load illness acupuncture data";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIllnessAcupunctures();
  }, []);
  return { illnessAcupunctures, loading, error };
}
