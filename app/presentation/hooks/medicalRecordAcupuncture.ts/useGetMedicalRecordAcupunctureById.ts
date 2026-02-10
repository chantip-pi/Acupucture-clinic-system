import { useState, useEffect } from "react";
import { getMedicalRecordAcupunctureByRecordIdUseCase } from "~/infrastructure/di/container";
import { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";

export function useGetMedicalRecordAcupunctureById(recordId: number | null) {
  const [acupunctureRecords, setAcupunctureRecords] = useState<
    MedicalRecordAcupuncture[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!recordId) {
      setError("No record ID provided");
      setLoading(false);
      return;
    }
    const fetchAcupunctureRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMedicalRecordAcupunctureByRecordIdUseCase.execute(
          recordId,
        );
        if (data) {
          setAcupunctureRecords(data);
        } else {
          setError("No data found for this record ID.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load acupuncture records";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcupunctureRecords();
  }, [recordId]);
  return { acupunctureRecords, loading, error };
}
