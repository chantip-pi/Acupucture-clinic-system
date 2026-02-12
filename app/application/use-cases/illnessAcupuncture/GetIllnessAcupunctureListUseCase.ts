import { IIllnessAcupunctureRepository } from "~/domain/repositories/IIllnessAcupunctureRepository";
import { IllnessAcupuncture } from "~/domain/entities/IllnessAcupuncture";

export class GetIllnessAcupunctureListUseCase {
  constructor(
    private readonly illnessAcupunctureRepository: IIllnessAcupunctureRepository,
  ) {}

  async execute(): Promise<IllnessAcupuncture[]> {
    return await this.illnessAcupunctureRepository.getAll();
  }
}
