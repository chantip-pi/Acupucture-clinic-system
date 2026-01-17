import { useState, useEffect } from "react";
import { getAcupointListUseCase } from "~/infrastructure/di/container";
import { Acupoint } from "~/domain/entities/Acupoint";

export function useGetAcupointList(acupointCodes: string[] | null) {
  const [acupoints, setAcupoints] = useState<Acupoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    if (!acupointCodes || acupointCodes.length === 0) {
      setError("No acupoint codes provided");
      setLoading(false);
      return;
    }
    const fetchAcupoints = async () => {
      setLoading(true);
      setError(null);
        try {
        const data = await getAcupointListUseCase.execute();
        setAcupoints(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load acupoint data";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      } 
    };
    fetchAcupoints();
  }, [acupointCodes]);
    return { acupoints, loading, error };
}