import { IIllnessAcupunctureRepository } from "~/domain/repositories/IIllnessAcupunctureRepository";
import { IllnessAcupuncture } from "~/domain/entities/IllnessAcupuncture";

export class GetIllnessAcupunctureByIdUseCase {
  constructor(
    private readonly illnessAcupunctureRepository: IIllnessAcupunctureRepository,
  ) {}

  async execute(illnessId: number): Promise<IllnessAcupuncture[]> {
    return await this.illnessAcupunctureRepository.getByIllnessId(illnessId);
  }
}
