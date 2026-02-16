import { useState, useEffect } from "react";
import { getMedicalRecordIllnessListUseCase } from "~/infrastructure/di/container";
import { MedicalRecordIllness } from "~/domain/entities/MedicalRecordIllness";

export function useGetMedicalRecordIllnessList() {
  const [illnessRecords, setIllnessRecords] = useState<
    MedicalRecordIllness[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIllnesssRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMedicalRecordIllnessListUseCase.execute();
        setIllnessRecords(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load illness records";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIllnesssRecords();
  }, []);
  return { illnessRecords, loading, error };
}
