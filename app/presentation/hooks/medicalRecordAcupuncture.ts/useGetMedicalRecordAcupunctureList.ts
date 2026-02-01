import { useState, useEffect } from "react";
import { getMedicalRecordAcupunctureListUseCase } from "~/infrastructure/di/container";
import { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";

export function useGetMedicalRecordAcupunctureList() {
  const [acupunctureRecords, setAcupunctureRecords] = useState<
    MedicalRecordAcupuncture[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcupunctureRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMedicalRecordAcupunctureListUseCase.execute();
        setAcupunctureRecords(data);
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
  }, []);
  return { acupunctureRecords, loading, error };
}
