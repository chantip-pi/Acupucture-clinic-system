import { IMedicalRecordIllnessRepository } from "~/domain/repositories/IMedicalRecordIllnessRepository";
import { MedicalRecordIllness } from "~/domain/entities/MedicalRecordIllness";

export class GetMedicalRecordIllnessByRecordIdUseCase {
  constructor(
    private readonly medicalRecordIllnessRepository: IMedicalRecordIllnessRepository,
  ) {}

    async execute(recordId: number): Promise<MedicalRecordIllness[]> {
        return await this.medicalRecordIllnessRepository.getByRecordId(recordId);
    }
}