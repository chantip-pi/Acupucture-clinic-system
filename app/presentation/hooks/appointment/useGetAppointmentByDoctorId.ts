import { useState, useEffect } from "react";
import { getAppointmentByDoctorIdUseCase } from "~/infrastructure/di/container";
import { Appointment } from "~/domain/entities/Appointment";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetAppointmentById(id: number | null) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No appointment ID provided");
      setLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAppointmentByDoctorIdUseCase.execute(id);
        if (data) {
          setAppointment(data);
        } else {
          setError("No data found for this appointment ID.");
        }
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  return { appointment, loading, error };
}

