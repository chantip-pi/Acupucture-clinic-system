import { useEffect, useState } from "react";
import { getAssignedStaffUseCase } from "~/infrastructure/di/container";
import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetAssignedStaff(medicalRecordId: number | null) {
  const [staffs, setStaffs] = useState<StaffNameDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (medicalRecordId === null) return;

    const fetchAssignedStaff = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAssignedStaffUseCase.execute(medicalRecordId);
        setStaffs(data ?? []);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedStaff();
  }, [medicalRecordId]);

  return { staffs, loading, error };
}
