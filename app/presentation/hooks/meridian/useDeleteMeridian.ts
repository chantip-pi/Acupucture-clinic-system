import { useState } from "react";
import { deleteMeridianUsecase } from "~/infrastructure/di/container";

export function useDeleteMeridian() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteMeridian = async (meridianId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMeridianUsecase.execute(meridianId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete Meridian";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteMeridian, loading, error };
}
