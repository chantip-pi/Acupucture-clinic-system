import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";
import { AcupointLocation } from "~/domain/entities/AcupointLocation";

export class GetAcupointLocationByIdUseCase {
  constructor(
    private readonly acupointLocationRepository: IAcupointLocationRepository
  ) {}
  async execute(locationId: number): Promise<AcupointLocation | null> {
    return await this.acupointLocationRepository.getById(locationId);
  }
}
