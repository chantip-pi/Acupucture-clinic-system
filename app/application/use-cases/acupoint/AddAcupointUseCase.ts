import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";
import { CreateAcupointDTO } from "~/application/dtos/AcupointDTO";

export class AddAcupointUseCase {
  constructor(private readonly acupointRepository: IAcupointRepository) {}
  
  async execute(dto: CreateAcupointDTO): Promise<void> {
    const existingCode = await this.acupointRepository.getByCode(
      dto.acupointCode
    );

    if (existingCode) {
      throw new Error("The selected acupoint code is already taken. Please choose a different code.");
    }
    await this.acupointRepository.create(dto);
  }
}
