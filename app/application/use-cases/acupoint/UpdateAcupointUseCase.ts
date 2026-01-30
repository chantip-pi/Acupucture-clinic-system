import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";
import { UpdateAcupointDTO } from "~/application/dtos/AcupointDTO";

export class UpdateAcupointUseCase {
  constructor(private readonly acupointRepository: IAcupointRepository) {}
  
  async execute(dto: UpdateAcupointDTO): Promise<void> {
    await this.acupointRepository.update(dto);
  }
}
