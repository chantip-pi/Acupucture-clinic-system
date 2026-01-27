import { useState } from "react";
import { cancelAppointmentUseCase } from "~/infrastructure/di/container";
import { UpdateAppointmentDTO } from "~/application/dtos/AppointmentDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useCancelAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelAppointment = async (dto: UpdateAppointmentDTO) => {
    setLoading(true);
    setError(null);

    try {
      await cancelAppointmentUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { cancelAppointment, loading, error };
}

