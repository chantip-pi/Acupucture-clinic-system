import { useState } from "react";
import { getAcupointByCodeUseCase } from "~/infrastructure/di/container";
import { Acupoint } from "~/domain/entities/Acupoint";

export function useGetAcupointByCode(acupointCode: string | null) {
  const [acupoint, setAcupoint] = useState<Acupoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getAcupointByCode = async () => {
    if (!acupointCode) {
      setError("No acupoint code provided");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getAcupointByCodeUseCase.execute(acupointCode);
      if (data) {
        setAcupoint(data);
      } else {
        setError("No data found for this acupoint code.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load acupoint data";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return { getAcupointByCode, acupoint, loading, error };
}
