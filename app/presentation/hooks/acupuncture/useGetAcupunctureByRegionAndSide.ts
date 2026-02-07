import { useState, useEffect } from "react";
import { getAcupunctureByRegionAndSideUseCase } from "~/infrastructure/di/container";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export function useGetAcupunctureByRegionAndSide(region: string, side: string) {
  const [acupunctures, setAcupunctures] = useState<Acupuncture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    const fetchAcupunctures = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAcupunctureByRegionAndSideUseCase.execute(region, side);
            setAcupunctures(data);
        } catch (err) {
            const errorMessage =
            err instanceof Error
                ? err.message
                : "Failed to load acupunctures by region and side";
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchAcupunctures();
  }, [region, side]);
  return { acupunctures, loading, error };
}