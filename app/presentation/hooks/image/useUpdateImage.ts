import { useState } from "react";
import { updateImageUseCase } from "~/infrastructure/di/container";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useUpdateImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateImage = async (filename: string, file: File): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateImageUseCase.execute(filename, file);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { updateImage, loading, error, success, reset };
}
