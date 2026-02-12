import { useState } from "react";
import { deleteIllnessAcupunctureUseCase } from "~/infrastructure/di/container";

export function useDeleteIllnessAcupuncture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteIllnessAcupuncture = async (
    illnessId: number,
    acupunctureId: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await deleteIllnessAcupunctureUseCase.execute(illnessId, acupunctureId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteIllnessAcupuncture, loading, error };
}
