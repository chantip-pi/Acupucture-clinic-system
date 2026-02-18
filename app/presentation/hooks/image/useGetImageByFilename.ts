import { useState, useEffect } from "react";
import { getImageByFilenameUseCase } from "~/infrastructure/di/container";
import { Image } from "~/domain/entities/Image";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetImageByFilename(filename: string) {
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!filename) {
        setImage(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getImageByFilenameUseCase.execute(filename);
        setImage(data);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [filename]);

  return { image, loading, error };
}
