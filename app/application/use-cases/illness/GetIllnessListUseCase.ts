import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { Illness } from "~/domain/entities/Illness";

export class GetIllnessListUseCase {
  constructor(private readonly illnessRepository: IIllnessRepository) {}
  
  async execute(): Promise<Illness[]> {
    return await this.illnessRepository.getAll();
  }
}