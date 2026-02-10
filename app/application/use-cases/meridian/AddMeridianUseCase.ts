import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { CreateMeridianDTO } from "~/application/dtos/MeridianDTO";
import { Meridian } from "~/domain/entities/Meridian";

export class AddMeridianUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(dto: CreateMeridianDTO): Promise<Meridian> {
    // Convert DTO to Meridian entity, omitting meridianId as it's auto-generated
    const meridian: Omit<Meridian, "meridianId"> = {
      meridianName: dto.meridianName,
      region: dto.region,
      side: dto.side,
      image: dto.image,
    };
    return await this.meridianRepository.create(meridian);
  }
}