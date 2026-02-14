import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { CreateIllnessDTO } from "~/application/dtos/IllnessDTO";
import { Illness } from "~/domain/entities/Illness";

export class AddIllnessUseCase {
  constructor(private readonly illnessRepository: IIllnessRepository) {}
  
  async execute(dto: CreateIllnessDTO): Promise<Illness> {
    return await this.illnessRepository.create(dto);
  }
}