import { useState } from "react";
import { updateStaffUseCase } from "~/infrastructure/di/container";
import { UpdateStaffDTO } from "~/application/dtos/StaffDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useUpdateStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStaff = async (dto: UpdateStaffDTO) => {
    setLoading(true);
    setError(null);

    try {
      await updateStaffUseCase.execute(dto);
      return { success: true };
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { updateStaff, loading, error };
}

