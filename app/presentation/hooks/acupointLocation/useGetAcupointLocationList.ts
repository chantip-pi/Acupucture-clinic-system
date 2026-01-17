import { useState, useEffect } from "react";
import { getAcupointLocationListUseCase } from "~/infrastructure/di/container";
import { AcupointLocation } from "~/domain/entities/AcupointLocation";

export function useGetAcupointLocationList() {
  const [acupointLocations, setAcupointLocations] = useState<
    AcupointLocation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcupointLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAcupointLocationListUseCase.execute();
        setAcupointLocations(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load acupoint location data";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcupointLocations();
  }, []);

  return { acupointLocations, loading, error };
}
