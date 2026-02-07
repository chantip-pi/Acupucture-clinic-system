import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { Acupuncture } from "~/domain/entities/Acupuncture";

export class GetAcupunctureByRegionAndSideUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}
  
  async execute(region: string, side: string): Promise<Acupuncture[]> {
    return await this.acupunctureRepository.getByRegionAndSide(region, side);
  }
}