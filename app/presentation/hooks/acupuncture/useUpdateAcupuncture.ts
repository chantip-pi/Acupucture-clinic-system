import { useState } from "react";
import { updateAcupunctureUseCase } from "~/infrastructure/di/container";
import { UpdateAcupunctureDTO } from "~/application/dtos/AcupunctureDTO";

export function useUpdateAcupuncture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const updateAcupuncture = async (dto: UpdateAcupunctureDTO) => {
    setLoading(true);
    setError(null);
    try {
      await updateAcupunctureUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update acupuncture";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { updateAcupuncture, loading, error };
}
