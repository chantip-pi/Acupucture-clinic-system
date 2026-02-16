import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export class GetAcupunctureByMeridianNameUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}

    async execute(meridianName: string): Promise<Acupuncture[]> {
    return await this.acupunctureRepository.getByMeridianName(meridianName);
  }
}