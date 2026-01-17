import { useState } from "react";
import { deleteAcupointUsecase } from "~/infrastructure/di/container";

export function useDeleteAcupoint() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const deleteAcupoint = async (acupointCode: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAcupointUsecase.execute(acupointCode);
      return { success: true };
    }
    catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete acupoint";
      setError(message);
      return { success: false, error: message };
    }
    finally {
        setLoading(false);
    }
  }
    return { deleteAcupoint, loading, error };
}