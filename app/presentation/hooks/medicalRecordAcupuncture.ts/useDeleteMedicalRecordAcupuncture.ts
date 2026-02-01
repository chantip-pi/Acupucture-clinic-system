import { useState } from "react";
import { deleteMedicalRecordAcupunctureUseCase } from "~/infrastructure/di/container";

export function useDeleteMedicalRecordAcupuncture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMedicalRecordAcupuncture = async (
    recordId: number,
    acupunctureId: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMedicalRecordAcupunctureUseCase.execute(
        recordId,
        acupunctureId,
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
  return { deleteMedicalRecordAcupuncture, loading, error };
}
