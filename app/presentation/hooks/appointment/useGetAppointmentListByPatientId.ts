import { useState, useEffect } from "react";
import { getAppointmentListByPatientIdUseCase } from "~/infrastructure/di/container";
import { Appointment } from "~/domain/entities/Appointment";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetAppointmentListByPatientId(id: number | null) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No patient ID provided");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAppointmentListByPatientIdUseCase.execute(id);
        if (data) {
          setAppointments(data);
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

    fetchAppointments();
  }, [id]);

  return { appointments, loading, error };
}

