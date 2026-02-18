import { IImageRepository } from "~/domain/repositories/IImageRepository";

export class DeleteImageUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(filename: string): Promise<void> {
    if (!filename) {
      throw new Error("Filename is required");
    }

    await this.imageRepository.delete(filename);
  }
}
