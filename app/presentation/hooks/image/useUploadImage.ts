import { useState } from "react";
import { uploadImageUseCase } from "~/infrastructure/di/container";
import { Image } from "~/domain/entities/Image";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useUploadImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadImage = async (file: File): Promise<Image | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await uploadImageUseCase.execute(file);
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

  return { uploadImage, loading, error, success, reset };
}
