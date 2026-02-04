import { useState } from "react";
import { updateMedicalRecordUseCase } from "~/infrastructure/di/container";
import { UpdateMedicalRecordDTO } from "~/application/dtos/MedicalRecordDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useUpdateMedicalRecord() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMedicalRecord = async (dto: UpdateMedicalRecordDTO) => {
    setLoading(true);
    setError(null);

    try {
      await updateMedicalRecordUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { updateMedicalRecord, loading, error };
}
