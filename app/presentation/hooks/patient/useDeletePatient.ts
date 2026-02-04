import { useState } from "react";
import { deletePatientUsecase } from "~/infrastructure/di/container";
import { BackendErrorService } from "~/domain/services/ErrorService";

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
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { deletePatient, loading, error };
}

