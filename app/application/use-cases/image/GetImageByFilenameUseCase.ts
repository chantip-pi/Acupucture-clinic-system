import { IImageRepository } from "~/domain/repositories/IImageRepository";
import { Image } from "~/domain/entities/Image";

export class GetImageByFilenameUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(filename: string): Promise<Image | null> {
    return await this.imageRepository.getByFilename(filename);
  }
}
