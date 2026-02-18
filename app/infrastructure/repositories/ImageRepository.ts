import { IImageRepository } from "~/domain/repositories/IImageRepository";
import { Image } from "~/domain/entities/Image";
import { ImageDataSource } from "../datasource/ImageDataSource";

export class ImageRepository implements IImageRepository {
  constructor(private readonly dataSource: ImageDataSource) {}

  async getAll(): Promise<Image[]> {
    return await this.dataSource.getAll();
  }

  async getByFilename(filename: string): Promise<Image | null> {
    return await this.dataSource.getByFilename(filename);
  }

  async create(file: File): Promise<Image> {
    return await this.dataSource.create(file);
  }

  async update(filename: string, file: File): Promise<Image> {
    return await this.dataSource.update(filename, file);
  }

  async delete(filename: string): Promise<void> {
    await this.dataSource.delete(filename);
  }
}
