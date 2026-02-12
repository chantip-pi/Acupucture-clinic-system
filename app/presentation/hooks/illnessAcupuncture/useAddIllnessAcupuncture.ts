import { useState } from "react";
import { addIllnessAcupunctureUseCase } from "~/infrastructure/di/container";
import { CreateIllnessAcupunctureDTO } from "~/application/dtos/IllnessAcupunctureDTO";

export function useAddIllnessAcupuncture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addIllnessAcupuncture = async (dto: CreateIllnessAcupunctureDTO) => {
    setLoading(true);
    setError(null);
    try {
      await addIllnessAcupunctureUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to add illness acupuncture";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addIllnessAcupuncture, loading, error };
}
