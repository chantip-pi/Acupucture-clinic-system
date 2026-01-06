import { IPatientRepository } from "~/domain/repositories/IPatientRepository";

export class DeletePatientUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

   async execute(patientId: number): Promise<void> {
    return await this.patientRepository.delete(patientId);
  }
}