import { useState, useEffect } from "react";
import { getStaffByUsernameUseCase } from "~/infrastructure/di/container";
import { Staff } from "~/domain/entities/Staff";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetStaffByUsername(username: string | null) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setStaff(null);
      return;
    }

    const fetchStaff = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getStaffByUsernameUseCase.execute(username);
        setStaff(data);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [username]);

  return { staff, loading, error };
}

