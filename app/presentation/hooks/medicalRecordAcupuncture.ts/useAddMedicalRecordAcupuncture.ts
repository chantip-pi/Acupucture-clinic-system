import { useState } from "react";
import { addMedicalRecordAcupunctureUseCase } from "~/infrastructure/di/container";
import { CreateMedicalRecordAcupunctureDTO } from "~/application/dtos/MedicalRecordAcupunctureDTO";

export function useAddMedicalRecordAcupuncture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addMedicalRecordAcupuncture = async (
    dto: CreateMedicalRecordAcupunctureDTO,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await addMedicalRecordAcupunctureUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to add medical record acupuncture";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addMedicalRecordAcupuncture, loading, error };
}
