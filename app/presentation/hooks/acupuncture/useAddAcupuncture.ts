import { useState } from "react";
import { addAcupunctureUseCase } from "~/infrastructure/di/container";
import { CreateAcupunctureDTO } from "~/application/dtos/AcupunctureDTO";

export function useAddAcupuncture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAcupuncture = async (dto: CreateAcupunctureDTO) => {
    setLoading(true);
    setError(null);
    try {
      await addAcupunctureUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add acupuncture";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addAcupuncture, loading, error };
}
