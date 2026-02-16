import { useState, useEffect } from "react";
import { getMedicalRecordIllnessByRecordIdUseCase } from "~/infrastructure/di/container";
import { MedicalRecordIllness } from "~/domain/entities/MedicalRecordIllness";

export function useGetMedicalRecordIllnessById(recordId: number | null) {
  const [illnessRecords, setIllnessRecords] = useState<
    MedicalRecordIllness[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!recordId) {
      setError("No record ID provided");
      setLoading(false);
      return;
    }
    const fetchIllnesssRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMedicalRecordIllnessByRecordIdUseCase.execute(
          recordId,
        );
        if (data) {
          setIllnessRecords(data);
        } else {
          setError("No data found for this record ID.");
        }
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
  }, [recordId]);
  return { illnessRecords, loading, error };
}
