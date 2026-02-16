import { useState } from "react";
import { createMedicalRecordUseCase } from "~/infrastructure/di/container";
import { CreateMedicalRecordDTO } from "~/application/dtos/MedicalRecordDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useCreateMedicalRecord() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMedicalRecord = async (dto: CreateMedicalRecordDTO): Promise<{
    success: boolean;
    error?: string;
    recordId?: number;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createMedicalRecordUseCase.execute(dto);
      return { 
        success: true,
        recordId: result.recordId
      };
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createMedicalRecord, loading, error };
}