import { useState } from "react";
import { deleteImageUseCase } from "~/infrastructure/di/container";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useDeleteImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteImage = async (filename: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await deleteImageUseCase.execute(filename);
      setSuccess(true);
      return true;
    } catch (err) {
      const errorMessage = BackendErrorService.getErrorMessage(err);
      setError(errorMessage);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { deleteImage, loading, error, success, reset };
}
