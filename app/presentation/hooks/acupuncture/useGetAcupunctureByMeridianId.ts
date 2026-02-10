import { useState, useEffect } from "react";
import { getAcupunctureByMeridianIdUseCase } from "~/infrastructure/di/container";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export function useGetAcupunctureByMeridianId(meridianId: number) {
  const [acupunctures, setAcupunctures] = useState<Acupuncture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAcupunctures = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAcupunctureByMeridianIdUseCase.execute(
          meridianId,
        );
        setAcupunctures(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load acupunctures by meridian ID";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcupunctures();
  }, [meridianId]);
  return { acupunctures, loading, error };
}
