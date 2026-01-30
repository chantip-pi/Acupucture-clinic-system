import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";

export class DeleteAcupointUseCase {
  constructor(private readonly acupointRepository: IAcupointRepository) {}
  
    async execute(acupointCode: string): Promise<void> {
    return await this.acupointRepository.delete(acupointCode);
  }
}