import { IImageRepository } from "~/domain/repositories/IImageRepository";

export class GetImageByFilenameUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(filename: string): Promise<string | null> {
    return await this.imageRepository.getByFilename(filename);
  }
}
