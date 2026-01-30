import { useState } from "react";
import { addAcupointLocationUseCase } from "~/infrastructure/di/container";
import { CreateAcupointLocationDTO } from "~/application/dtos/AcupointLocationDTO";

export function useAddAcupointLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAcupointLocation = async (dto: CreateAcupointLocationDTO) => {
    setLoading(true);
    setError(null);
    try {
      await addAcupointLocationUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add acupoint location";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addAcupointLocation, loading, error };
}
