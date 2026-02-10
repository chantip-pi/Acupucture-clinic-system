import { useState } from "react";
import { deleteIllnessUsecase } from "~/infrastructure/di/container";

export function useDeleteIllness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteIllness = async (illnessId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteIllnessUsecase.execute(illnessId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete illness";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteIllness, loading, error };
}
