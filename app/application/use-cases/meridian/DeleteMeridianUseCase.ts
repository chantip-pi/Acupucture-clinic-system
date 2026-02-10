import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";

export class DeleteMeridianUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(meridianId: number): Promise<void> {
    await this.meridianRepository.delete(meridianId);
  }
}