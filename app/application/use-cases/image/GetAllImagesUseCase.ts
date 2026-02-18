import { IImageRepository } from "~/domain/repositories/IImageRepository";
import { Image } from "~/domain/entities/Image";

export class GetAllImagesUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(): Promise<Image[]> {
    const images = await this.imageRepository.getAll();
    return images
  }
}
