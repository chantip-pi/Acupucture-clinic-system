import { IMedicalRecordIllnessRepository } from "~/domain/repositories/IMedicalRecordIllnessRepository";
import { MedicalRecordIllness } from "~/domain/entities/MedicalRecordIllness";

export class GetMedicalRecordIllnessListUseCase {
  constructor(
    private readonly medicalRecordIllnessRepository: IMedicalRecordIllnessRepository,
  ) {}

  async execute(): Promise<MedicalRecordIllness[]> {
    return await this.medicalRecordIllnessRepository.getAll();
  }
}
