import { useState } from "react";
import { addMeridianUseCase } from "~/infrastructure/di/container";
import { CreateMeridianDTO } from "~/application/dtos/MeridianDTO";

export function useAddMeridian() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMeridian = async (dto: CreateMeridianDTO) => {
    setLoading(true);
    setError(null);
    try {
      const createdMeridian = await addMeridianUseCase.execute(dto);
      return { success: true, meridian: createdMeridian };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add meridian";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addMeridian, loading, error };
}