import { useEffect, useState } from "react";
import { getMedicalRecordListByPatientIdUseCase } from "~/infrastructure/di/container";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetMedicalRecordListByPatientId(patientId: number | null) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId === null) return;

    const fetchMedicalRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMedicalRecordListByPatientIdUseCase.execute(patientId);
        setMedicalRecords(data ?? []);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [patientId]);

  return { medicalRecords, loading, error };
}
