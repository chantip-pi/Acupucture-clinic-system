import { useState } from "react";
import { getSuggestUseCase } from "~/infrastructure/di/container";
import { SuggestResult } from "~/domain/entities/Suggestion";

export function useGetSuggest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SuggestResult | null>(null);

  const getSuggest = async (symptoms: string, imageData?: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const diagnosisResult = await getSuggestUseCase.execute(symptoms, imageData);
      setResult(diagnosisResult);
      return { success: true, result: diagnosisResult };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get suggestion";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { getSuggest, loading, error, result };
}