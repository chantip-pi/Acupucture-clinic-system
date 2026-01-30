import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { Meridian } from "~/domain/entities/Meridian";

export class GetMeridianByIdUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(meridianId: number): Promise<Meridian | null> {
    return await this.meridianRepository.getById(meridianId);
  }
}