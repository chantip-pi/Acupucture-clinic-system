import { useState } from "react";
import { deleteMedicalRecordIllnessUseCase } from "~/infrastructure/di/container";

export function useDeleteMedicalRecordIllness() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMedicalRecordIllness = async (
    recordId: number,
    illnessId: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMedicalRecordIllnessUseCase.execute(
        recordId,
        illnessId,
      );
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteMedicalRecordIllness, loading, error };
}
