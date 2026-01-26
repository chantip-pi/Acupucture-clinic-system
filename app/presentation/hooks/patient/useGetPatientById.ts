import { useState, useEffect } from "react";
import { getPatientByIdUseCase } from "~/infrastructure/di/container";
import { Patient } from "~/domain/entities/Patient";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetPatientById(id: number | null) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No patient ID provided");
      setLoading(false);
      return;
    }

    const fetchPatient = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPatientByIdUseCase.execute(id);
        if (data) {
          setPatient(data);
        } else {
          setError("No data found for this patient ID.");
        }
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  return { patient, loading, error };
}

