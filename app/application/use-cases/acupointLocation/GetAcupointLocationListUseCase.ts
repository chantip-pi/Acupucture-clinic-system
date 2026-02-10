import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";
import { AcupointLocation } from "~/domain/entities/AcupointLocation";

export class GetAcupointLocationListUseCase {
  constructor(
    private readonly acupointLocationRepository: IAcupointLocationRepository
  ) {}
  async execute(): Promise<AcupointLocation[]> {
    const acupointLocations = await this.acupointLocationRepository.getAll();
    return acupointLocations.sort((a, b) => a.locationId - b.locationId);
  }
}
