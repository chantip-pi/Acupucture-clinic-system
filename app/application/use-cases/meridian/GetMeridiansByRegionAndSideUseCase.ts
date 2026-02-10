import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { Meridian } from "~/domain/entities/Meridian";

export class GetMeridiansByRegionAndSideUseCase {
    
  constructor(private readonly meridianRepository: IMeridianRepository) {}
    async execute(region: string, side: string): Promise<Meridian[]> {
        return await this.meridianRepository.getByRegionAndSide(region, side);
    }
}