import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export class GetAcupunctureListUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}

  async execute(): Promise<Acupuncture[]> {
    const acupunctures = await this.acupunctureRepository.getAll();
    return acupunctures.sort((a, b) => a.acupunctureId - b.acupunctureId);
  }
}
