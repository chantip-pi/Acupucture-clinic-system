import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { Meridian } from "~/domain/entities/Meridian";

export class GetMeridianSideByRegionUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(region: string[]): Promise<Record<string, string[]>> {
    return await this.meridianRepository.getSidesByRegion(region);
  }
}