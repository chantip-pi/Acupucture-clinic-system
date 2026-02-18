import { useState, useEffect } from "react";
import { getAllImagesUseCase } from "~/infrastructure/di/container";
import { BackendErrorService } from "~/domain/services/ErrorService";

export function useGetAllImages() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllImagesUseCase.execute();
        setImages(data);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const refetch = () => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllImagesUseCase.execute();
        setImages(data);
      } catch (err) {
        const errorMessage = BackendErrorService.getErrorMessage(err);
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  };

  return { images, loading, error, refetch };
}
