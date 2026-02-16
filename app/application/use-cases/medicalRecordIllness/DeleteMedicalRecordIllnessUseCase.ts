import { IMedicalRecordIllnessRepository } from "~/domain/repositories/IMedicalRecordIllnessRepository";

export class DeleteMedicalRecordIllnessUseCase {
  constructor(
    private readonly medicalRecordIllnessRepository: IMedicalRecordIllnessRepository,
  ) {}
    async execute(recordId: number, illnessId: number): Promise<void> {
        await this.medicalRecordIllnessRepository.delete(recordId, illnessId);
    }
}