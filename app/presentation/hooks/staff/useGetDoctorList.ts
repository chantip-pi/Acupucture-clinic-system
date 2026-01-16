import { useState, useEffect } from "react";
import { staffDatasource } from "~/infrastructure/datasource/StaffDataSource";
import { StaffNameDTO } from "~/application/dtos/StaffDTO";

export function useGetDoctorList() {
  const [doctors, setDoctors] = useState<StaffNameDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await staffDatasource.getDoctors();
        setDoctors(data);
      } catch (err) {
        setError("Failed to load doctors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
}

