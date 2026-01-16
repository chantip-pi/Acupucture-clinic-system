import { useState } from "react";
import { createAppointmentUseCase } from "~/infrastructure/di/container";
import { CreateAppointmentDTO } from "~/application/dtos/AppointmentDTO";

export function useCreateAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = async (dto: CreateAppointmentDTO) => {
    setLoading(true);
    setError(null);

    try {
      await createAppointmentUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create appointment";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createAppointment, loading, error };
}

