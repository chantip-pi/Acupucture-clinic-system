import { useState } from "react";
import { deleteAllIllnessForRecordUseCase } from "~/infrastructure/di/container";

export function useDeleteAllIllnessFromRecord() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const deleteAllIllnessForRecord = async (recordId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAllIllnessForRecordUseCase.execute(recordId);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete all illnesses from record";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { deleteAllIllnessForRecord, loading, error };
}
