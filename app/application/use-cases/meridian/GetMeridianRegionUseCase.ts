import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { Meridian } from "~/domain/entities/Meridian";

export class GetMeridianRegionUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(): Promise<string[]> {
    return await this.meridianRepository.getAvailableRegions();
  }
}