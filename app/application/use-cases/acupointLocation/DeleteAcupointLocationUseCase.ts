import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";

export class DeleteAcupointLocationUseCase {
  constructor(
    private readonly acupointLocationRepository: IAcupointLocationRepository
  ) {}
  async execute(locationId: number): Promise<void> {
    return await this.acupointLocationRepository.delete(locationId);
  }
}
