import { IImageRepository } from "~/domain/repositories/IImageRepository";
import { ImageDataSource } from "../datasource/ImageDataSource";
import { ImageUploadResponse, ImageUpdateResponse } from "~/domain/entities/Image";

export class ImageRepository implements IImageRepository {
  constructor(private readonly dataSource: ImageDataSource) {}

  async getAll(): Promise<string[]> {
    return await this.dataSource.getAll();
  }

  async getByFilename(filename: string): Promise<string | null> {
    return await this.dataSource.getByFilename(filename);
  }

  async create(file: File): Promise<ImageUploadResponse> {
    return await this.dataSource.create(file);
  }

  async update(filename: string, file: File): Promise<ImageUpdateResponse> {
    return await this.dataSource.update(filename, file);
  }

  async delete(filename: string): Promise<void> {
    await this.dataSource.delete(filename);
  }
}
