import { useState } from "react";
import { updateMeridianUseCase } from "~/infrastructure/di/container";
import { UpdateMeridianDTO } from "~/application/dtos/MeridianDTO";

export function useUpdateMeridian() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateMeridian = async (dto: UpdateMeridianDTO) => {
    setLoading(true);
    setError(null);
    try {
      await updateMeridianUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update meridian";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { updateMeridian, loading, error };
}
