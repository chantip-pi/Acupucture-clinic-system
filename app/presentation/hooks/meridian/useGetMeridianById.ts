import { useState, useEffect } from "react";
import { getMeridianByIdUseCase } from "~/infrastructure/di/container";
import { Meridian } from "~/domain/entities/Meridian";

export function useGetMeridianById(meridianId: number | null) {
  const [meridian, setMeridian] = useState<Meridian | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!meridianId) {
      setError("No meridian ID provided");
      setLoading(false);
      return;
    }
    const fetchmeridian = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMeridianByIdUseCase.execute(meridianId);
        if (data) {
          setMeridian(data);
        } else {
          setError("No data found for this meridian ID.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load meridian data";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchmeridian();
  }, [meridianId]);
  return { meridian, loading, error };
}
