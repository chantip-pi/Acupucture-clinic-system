import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { Meridian } from "~/domain/entities/Meridian";

export class GetMeridianListUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(): Promise<Meridian[]> {
    return await this.meridianRepository.getAll();
  }
}