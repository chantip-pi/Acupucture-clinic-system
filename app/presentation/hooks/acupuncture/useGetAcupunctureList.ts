import { useState, useEffect } from "react";
import { getAcupunctureListUseCase } from "~/infrastructure/di/container";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export function useGetAcupunctureList() {
  const [acupunctures, setAcupunctures] = useState<Acupuncture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAcupunctures = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAcupunctureListUseCase.execute();
        setAcupunctures(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load acupuncture data";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcupunctures();
  }, []);
  return { acupunctures, loading, error };
}
