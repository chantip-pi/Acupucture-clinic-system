import { IIllnessAcupunctureRepository } from "~/domain/repositories/IIllnessAcupunctureRepository";

export class DeleteAllAcupunctureForIllnessUseCase {
  constructor(
    private readonly illnessAcupunctureRepository: IIllnessAcupunctureRepository,
  ) {}
  
  async execute(illnessId: number): Promise<void> {
    await this.illnessAcupunctureRepository.deleteAllAcupunctureByIllnessId(
      illnessId,
    );
  }
}
