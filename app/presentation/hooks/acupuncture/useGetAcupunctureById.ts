import { useState, useEffect } from "react";
import { getAcupunctureByIdUseCase } from "~/infrastructure/di/container";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export function useGetAcupunctureById(acupunctureId: number | null) {
  const [acupuncture, setAcupuncture] = useState<Acupuncture | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!acupunctureId) {
      setError("No acupuncture ID provided");
      setLoading(false);
      return;
    }
    const fetchAcupuncture = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAcupunctureByIdUseCase.execute(acupunctureId);
        if (data) {
          setAcupuncture(data);
        } else {
          setError("No data found for this acupuncture ID.");
        }
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
    fetchAcupuncture();
  }, [acupunctureId]);
  return { acupuncture, loading, error };
}
