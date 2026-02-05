import { useEffect, useState } from "react";
import { getMedicalRecordByIdUseCase } from "~/infrastructure/di/container";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetMedicalRecordById(medicalRecordId: number | null) {
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (medicalRecordId === null) return;

    const fetchMedicalRecord = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMedicalRecordByIdUseCase.execute(medicalRecordId);
        setMedicalRecord(data);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [medicalRecordId]);

  return { medicalRecord, loading, error };
}
