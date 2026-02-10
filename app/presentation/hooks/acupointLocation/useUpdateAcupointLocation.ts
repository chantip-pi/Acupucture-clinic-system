import { useState } from "react";
import { updateAcupointLocationUseCase } from "~/infrastructure/di/container";
import { UpdateAcupointLocationDTO } from "~/application/dtos/AcupointLocationDTO";

export function useUpdateAcupointLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateAcupointLocation = async (dto: UpdateAcupointLocationDTO) => {
    setLoading(true);
    setError(null);
    try {
      await updateAcupointLocationUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update acupoint location";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { updateAcupointLocation, loading, error };
}
