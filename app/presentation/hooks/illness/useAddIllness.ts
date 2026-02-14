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
     const result =  await addIllnessUseCase.execute(dto);
      return { success: result };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add illness";
      setError(errorMessage);
      return { success: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addIllness, loading, error };
}
