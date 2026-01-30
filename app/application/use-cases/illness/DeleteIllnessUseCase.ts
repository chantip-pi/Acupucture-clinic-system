import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";

export class DeleteIllnessUseCase {
  constructor(private readonly illnessRepository: IIllnessRepository) {}
  
  async execute(illnessId: number): Promise<void> {
    await this.illnessRepository.delete(illnessId);
  }
}