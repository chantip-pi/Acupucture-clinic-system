import { useState } from "react";
import { addIllnessUseCase } from "~/infrastructure/di/container";
import { CreateIllnessDTO } from "~/application/dtos/IllnessDTO";

export function useAddIllness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIllness = async (dto: CreateIllnessDTO) => {
    setLoading(true);
    setError(null);
    try {
      await addIllnessUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add illness";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addIllness, loading, error };
}
