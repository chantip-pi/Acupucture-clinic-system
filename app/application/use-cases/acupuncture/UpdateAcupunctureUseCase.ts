import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { UpdateAcupunctureDTO } from "~/application/dtos/AcupunctureDTO";

export class UpdateAcupunctureUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}
  
  async execute(dto: UpdateAcupunctureDTO): Promise<void> {
    await this.acupunctureRepository.update(dto);
  }
}