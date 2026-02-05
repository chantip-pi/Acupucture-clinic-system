import { useEffect, useState } from "react";
import { getMedicalRecordListUseCase } from "~/infrastructure/di/container";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetMedicalRecordList() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMedicalRecordListUseCase.execute();
        setMedicalRecords(data);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  return { medicalRecords, loading, error };
}
