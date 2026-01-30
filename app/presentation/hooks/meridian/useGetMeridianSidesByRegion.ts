import { useEffect, useState } from "react";
import { getMeridianSideByRegionUseCase } from "~/infrastructure/di/container";

export function useGetMeridianSidesByRegion(region: string[]) {
  const [data, setData] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!region || region.length === 0) {
      setData({});
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result =
          await getMeridianSideByRegionUseCase.execute(region);

        setData(result ?? {});
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load sides"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [region.join(",")]);

  return { sidesByRegion: data, loading, error };
}
