import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";
import { Acupoint } from "~/domain/entities/Acupoint";

export class GetAcupointByCodeUseCase {
  constructor(private readonly acupointRepository: IAcupointRepository) {}
  
  async execute(acupointCode: string): Promise<Acupoint | null> {
    return await this.acupointRepository.getByCode(acupointCode);
  }
}
