import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";
import { CreateAcupointLocationDTO } from "~/application/dtos/AcupointLocationDTO";

export class AddAcupointLocationUseCase {
  constructor(private readonly acupointLocationRepository: IAcupointLocationRepository) {}
  
  async execute(dto: CreateAcupointLocationDTO): Promise<void> {
    await this.acupointLocationRepository.create(dto);
  }
}
