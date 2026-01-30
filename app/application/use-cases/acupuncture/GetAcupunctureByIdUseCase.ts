import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export class GetAcupunctureByIdUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}
  
  async execute(acupunctureId: number): Promise<Acupuncture | null> {
    return await this.acupunctureRepository.getById(acupunctureId);
  }
}