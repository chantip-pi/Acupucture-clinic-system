import { useState, useEffect } from "react";
import { getMeridianNamesUseCase } from "~/infrastructure/di/container";

export function useGetMeridianNames() {
  const [meridians, setmeridians] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMeridians = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMeridianNamesUseCase.execute();
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
