import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";
import { Acupoint } from "~/domain/entities/Acupoint";

export class GetAcupointListUseCase {
  constructor(private readonly acupointRepository: IAcupointRepository) {}

  async execute(): Promise<Acupoint[]> {
    const acupoints = await this.acupointRepository.getAll();
    return acupoints.sort((a, b) =>
      a.acupointCode.localeCompare(b.acupointCode)
    );
  }
}
