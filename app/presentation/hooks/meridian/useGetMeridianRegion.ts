import { useEffect, useState } from "react";
import { Meridian } from "~/domain/entities/Meridian";
import { getMeridianRegionUseCase } from "~/infrastructure/di/container";

export function useGetMeridianRegion() {
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMeridianRegionUseCase.execute();
        setRegions(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load meridian region";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return { regions, loading, error };
}
