import { useState } from "react";
import { addMedicalRecordIllnessUseCase } from "~/infrastructure/di/container";
import { CreateMedicalRecordIllnessDTO } from "~/application/dtos/MedicalRecordIllnessDTO";

export function useAddMedicalRecordIllness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addMedicalRecordIllness = async (
    dto: CreateMedicalRecordIllnessDTO,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await addMedicalRecordIllnessUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to add medical record illness";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  return { addMedicalRecordIllness, loading, error };
}
