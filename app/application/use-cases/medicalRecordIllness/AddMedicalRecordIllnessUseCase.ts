import { IMedicalRecordIllnessRepository } from "~/domain/repositories/IMedicalRecordIllnessRepository";
import { CreateMedicalRecordIllnessDTO } from "~/application/dtos/MedicalRecordIllnessDTO";

export class AddMedicalRecordIllnessUseCase {
  constructor(
    private readonly medicalRecordIllnessRepository: IMedicalRecordIllnessRepository,
  ) {}

  async execute(dto: CreateMedicalRecordIllnessDTO): Promise<void> {
    const allRecords = await this.medicalRecordIllnessRepository.getAll();
    
    const isDuplicate = allRecords.some(
      record => record.recordId === dto.recordId && record.illnessId === dto.illnessId
    );

    if (isDuplicate) {
      throw new Error("This illness is already added to this medical record.");
    }
    await this.medicalRecordIllnessRepository.create(dto.recordId, dto);
  }
}
