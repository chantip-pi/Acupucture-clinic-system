import { IMedicalRecordIllnessRepository } from "~/domain/repositories/IMedicalRecordIllnessRepository";

export class DeleteAllIllnessForRecordUseCase {
  constructor(
    private readonly medicalRecordIllnessRepository: IMedicalRecordIllnessRepository,
  ) {}
    async execute(recordId: number): Promise<void> {
        await this.medicalRecordIllnessRepository.deleteAllIllnessByRecordId(recordId);
    }
}