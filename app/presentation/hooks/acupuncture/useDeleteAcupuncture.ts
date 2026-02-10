import { useState } from "react";
import { deleteAcupunctureUsecase } from "~/infrastructure/di/container";

export function useDeleteAcupuncture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteAcupuncture = async (acupunctureId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAcupunctureUsecase.execute(acupunctureId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete acupuncture";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteAcupuncture, loading, error };
}
