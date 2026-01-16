import { useState, useEffect } from "react";
import { getAppointmentListUseCase } from "~/infrastructure/di/container";
import { Appointment } from "~/domain/entities/Appointment";

export function useGetAppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAppointmentListUseCase.execute();
        setAppointments(data);
      } catch (err) {
        setError("Failed to load appointment data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading, error };
}

