import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";
import { UpdateAcupointLocationDTO } from "~/application/dtos/AcupointLocationDTO";

export class UpdateAcupointLocationUseCase {
  constructor(
    private readonly acupointLocationRepository: IAcupointLocationRepository
  ) {}
  async execute(dto: UpdateAcupointLocationDTO): Promise<void> {
    await this.acupointLocationRepository.update(dto);
  }
}
