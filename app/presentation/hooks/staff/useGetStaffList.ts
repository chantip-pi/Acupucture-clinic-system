import { useState, useEffect } from "react";
import { staffDatasource } from "~/infrastructure/datasource/StaffDataSource";
import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";


export function useGetStaffList() {
  const [staffs, setStaffs] = useState<StaffNameDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await staffDatasource.getStaffs();
        setStaffs(data);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  return { staffs, loading, error };
}

