import { useState, useEffect } from "react";
import { getMeridiansByRegionAndSideUseCase } from "~/infrastructure/di/container";
import { Meridian } from "~/domain/entities/Meridian";

export function useGetMeridiansByRegionAndSide(region: string, side: string) {
  const [meridians, setMeridians] = useState<Meridian[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMeridians = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMeridiansByRegionAndSideUseCase.execute(
          region,
          side,
        );
        setMeridians(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load meridian data";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeridians();
  }, [region, side]);
  return { meridians, loading, error };
}
