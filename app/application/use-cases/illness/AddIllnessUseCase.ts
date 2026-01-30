import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { CreateIllnessDTO } from "~/application/dtos/IllnessDTO";

export class AddIllnessUseCase {
  constructor(private readonly illnessRepository: IIllnessRepository) {}
  
  async execute(dto: CreateIllnessDTO): Promise<void> {
    await this.illnessRepository.create(dto);
  }
}