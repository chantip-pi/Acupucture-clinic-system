import { IIllnessAcupunctureRepository } from "~/domain/repositories/IIllnessAcupunctureRepository";

export class DeleteIllnessAcupunctureUseCase {
  constructor(
    private readonly illnessAcupunctureRepository: IIllnessAcupunctureRepository,
  ) {}

    async execute(illnessId: number, acupunctureId: number): Promise<void> {
        await this.illnessAcupunctureRepository.delete(illnessId, acupunctureId);
    }
}