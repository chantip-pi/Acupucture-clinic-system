import { useState, useEffect } from "react";
import { getAcupunctureByMeridianNameUseCase } from "~/infrastructure/di/container";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export function useGetAcupunctureByMeridianName(meridianName: string) {
  const [acupunctures, setAcupunctures] = useState<Acupuncture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAcupunctures = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAcupunctureByMeridianNameUseCase.execute(
          meridianName,
        );
        setAcupunctures(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load acupunctures by meridian name";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcupunctures();
  }, [meridianName]);
  return { acupunctures, loading, error };
}
