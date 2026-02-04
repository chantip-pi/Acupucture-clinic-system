import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";

export class GetMedicalRecordListUseCase {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.getAll();
  }
}
