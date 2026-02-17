import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";

export class GetMeridianNamesUseCase {
  constructor(private readonly meridianRepository: IMeridianRepository) {}
  
  async execute(): Promise<string[]> {
    return await this.meridianRepository.getAllNames();
  }
}