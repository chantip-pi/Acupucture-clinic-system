import { useState } from "react";
import { updateAcupointUseCase } from "~/infrastructure/di/container";
import { UpdateAcupointDTO } from "~/application/dtos/AcupointDTO";

export function useUpdateAcupoint() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateAcupoint = async (dto: UpdateAcupointDTO) => {
    setLoading(true);
    setError(null);
    try {
      await updateAcupointUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update acupoint";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { updateAcupoint, loading, error };
}
