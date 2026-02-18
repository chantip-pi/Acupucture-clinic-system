import { Image } from "../entities/Image";

export interface IImageRepository {
  getAll(): Promise<Image[]>;
  getByFilename(filename: string): Promise<Image | null>;
  create(file: File): Promise<Image>;
  update(filename: string, file: File): Promise<Image>;
  delete(filename: string): Promise<void>;
}
