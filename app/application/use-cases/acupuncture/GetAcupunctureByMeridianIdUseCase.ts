import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export class GetAcupunctureByMeridianIdUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}

    async execute(meridianId: number): Promise<Acupuncture[]> {
    return await this.acupunctureRepository.getByMeridianId(meridianId);
  }
}