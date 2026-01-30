import { useState } from "react";
import { addAcupointUseCase } from "~/infrastructure/di/container";
import { CreateAcupointDTO } from "~/application/dtos/AcupointDTO";

export function useAddAcupoint() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAcupoint = async (dto: CreateAcupointDTO) => {
    setLoading(true);
    setError(null);
    try {
      await addAcupointUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add acupoint";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addAcupoint, loading, error };
}
