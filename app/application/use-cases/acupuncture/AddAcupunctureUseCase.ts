import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { CreateAcupunctureDTO } from "~/application/dtos/AcupunctureDTO";

export class AddAcupunctureUseCase {
  constructor(private readonly acupunctureRepository: IAcupunctureRepository) {}

  async execute(dto: CreateAcupunctureDTO): Promise<void> {
    await this.acupunctureRepository.create(dto);
  }
}
