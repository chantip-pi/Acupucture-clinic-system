import { useState } from "react";
import { deleteAcupointLocationUsecase } from "~/infrastructure/di/container";

export function useDeleteAcupointLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAcupointLocation = async (acupointLocationId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAcupointLocationUsecase.execute(acupointLocationId);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete acupoint location";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { deleteAcupointLocation, loading, error };
}