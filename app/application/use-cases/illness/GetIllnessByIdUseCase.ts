import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { Illness } from "~/domain/entities/Illness";

export class GetIllnessByIdUseCase {
  constructor(private readonly illnessRepository: IIllnessRepository) {}
  
  async execute(illnessId: number): Promise<Illness | null> {
    return await this.illnessRepository.getById(illnessId);
  }
}