import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { UpdateIllnessDTO } from "~/application/dtos/IllnessDTO";

export class UpdateIllnessUseCase {
  constructor(private readonly illnessRepository: IIllnessRepository) {}
  
  async execute(dto: UpdateIllnessDTO): Promise<void> {
    await this.illnessRepository.update(dto);
  }
}