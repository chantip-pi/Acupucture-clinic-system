import { useState } from "react";
import { deleteAllAcupunctureForIllnessUseCase } from "~/infrastructure/di/container";

export function useDeleteAllAcupunctureFromIllness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAllAcupunctureFromIllness = async (illnessId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAllAcupunctureForIllnessUseCase.execute(illnessId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete all acupuncture from illness";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteAllAcupunctureFromIllness, loading, error };
}
