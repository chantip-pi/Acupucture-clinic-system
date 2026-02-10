import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { UpdateMeridianDTO } from "~/application/dtos/MeridianDTO";

export class UpdateMeridianUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(dto: UpdateMeridianDTO): Promise<void> {
    await this.meridianRepository.update(dto);
  }
}