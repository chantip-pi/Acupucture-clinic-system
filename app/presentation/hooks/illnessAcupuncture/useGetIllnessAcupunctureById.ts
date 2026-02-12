import { useState, useEffect } from "react";
import { getIllnessAcupunctureByIdUseCase } from "~/infrastructure/di/container";
import { IllnessAcupuncture } from "~/domain/entities/IllnessAcupuncture";

export function useGetIllnessAcupunctureById(illnessAcupunctureId: number | null) { 
  const [illnessAcupunctures, setIllnessAcupunctures] = useState<IllnessAcupuncture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!illnessAcupunctureId) {
      setError("No illness acupuncture ID provided");
      setLoading(false);
      return;
    }
    const fetchIllnessAcupuncture = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getIllnessAcupunctureByIdUseCase.execute(
          illnessAcupunctureId,
        );
        if (data) {
          setIllnessAcupunctures(data);
        } else {
          setError("No data found for this illness acupuncture ID.");
        }
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
    fetchIllnessAcupuncture();
  }, [illnessAcupunctureId]);
  return { illnessAcupunctures, loading, error };
}
