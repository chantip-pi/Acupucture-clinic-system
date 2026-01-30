import { useState, useEffect } from "react";
import { getAcupointLocationByIdUseCase } from "~/infrastructure/di/container";
import { AcupointLocation } from "~/domain/entities/AcupointLocation";

export function useGetAcupointLocationById(acupointLocationId: number | null) {
  const [acupointLocation, setAcupointLocation] = useState<AcupointLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!acupointLocationId) {
      setError("No acupoint location ID provided");
      setLoading(false);
      return;
    }
    const fetchAcupointLocation = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAcupointLocationByIdUseCase.execute(
          acupointLocationId,
        );
        if (data) {
          setAcupointLocation(data);
        } else {
          setError("No data found for this acupoint location ID.");
        }
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
    fetchAcupointLocation();
  }, [acupointLocationId]);
  return { acupointLocation, loading, error };
}
