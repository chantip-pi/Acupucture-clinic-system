import { useState } from "react";
import { deletePatientUsecase } from "~/infrastructure/di/container";

export function useDeletePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePatient = async (patientId: number) => {
    setLoading(true);
    setError(null);

    try {
      await deletePatientUsecase.execute(patientId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete patient";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { deletePatient, loading, error };
}

