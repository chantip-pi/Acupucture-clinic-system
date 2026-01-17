import { useState } from "react";
import { updateIllnessUseCase } from "~/infrastructure/di/container";
import { UpdateIllnessDTO } from "~/application/dtos/IllnessDTO";

export function useUpdateIllness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateIllness = async (dto: UpdateIllnessDTO) => {
    setLoading(true);
    setError(null);
    try {
      await updateIllnessUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update illness";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { updateIllness, loading, error };
}
