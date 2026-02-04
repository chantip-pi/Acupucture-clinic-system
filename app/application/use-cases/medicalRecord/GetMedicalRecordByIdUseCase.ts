import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";

export class GetMedicalRecordByIdUseCase {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(medicalRecordId: number): Promise<MedicalRecord | null> {
    return this.medicalRecordRepository.getById(medicalRecordId);
  }
}
