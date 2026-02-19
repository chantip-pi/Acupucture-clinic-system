import { IImageRepository } from "~/domain/repositories/IImageRepository";

export class UpdateImageUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(filename: string, file: File): Promise<string> {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image");
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error("File size must be less than 10MB");
    }

    return await this.imageRepository.update(filename, file);
  }
}
