import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";

export class DeleteAcupunctureUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}
  
  async execute(acupunctureId: number): Promise<void> {
    await this.acupunctureRepository.delete(acupunctureId);
  }
}