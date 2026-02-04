import { useState } from "react";
import { deleteStaffUsecase } from "~/infrastructure/di/container";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useDeleteStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStaff = async (staffId: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteStaffUsecase.execute(staffId);
      return { success: true };
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { deleteStaff, loading, error };
}

