
import { ImageUploadResponse, ImageUpdateResponse, ImageListResponse } from "~/domain/entities/Image";

export interface IImageRepository {
  getAll(): Promise<string[]>;
  getByFilename(filename: string): Promise<string | null>;
  create(file: File): Promise<ImageUploadResponse>;
  update(filename: string, file: File): Promise<ImageUpdateResponse>;
  delete(filename: string): Promise<void>;
}
