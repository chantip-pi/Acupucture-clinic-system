import { IImageRepository } from "~/domain/repositories/IImageRepository";

export class GetAllImagesUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(): Promise<string[]> {
    const images = await this.imageRepository.getAll();
    return images
  }
}
