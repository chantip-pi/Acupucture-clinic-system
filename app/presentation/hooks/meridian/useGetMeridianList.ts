import { useState, useEffect } from "react";
import { getMeridianListUseCase } from "~/infrastructure/di/container";
import { Meridian } from "~/domain/entities/Meridian";

export function useGetMeridianList() {
  const [meridians, setmeridians] = useState<Meridian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMeridians = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMeridianListUseCase.execute();
        setmeridians(data);
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
    fetchMeridians();
  }, []);
  return { meridians, loading, error };
}
