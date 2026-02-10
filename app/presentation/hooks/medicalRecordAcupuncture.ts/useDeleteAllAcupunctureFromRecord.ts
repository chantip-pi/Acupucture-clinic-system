import { useState } from "react";
import { deleteAllAcupunctureForRecordUseCase } from "~/infrastructure/di/container";

export function useDeleteAllAcupunctureFromRecord() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteAllAcupunctureFromRecord = async (recordId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAllAcupunctureForRecordUseCase.execute(recordId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete all acupuncture from record";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteAllAcupunctureFromRecord, loading, error };
}
