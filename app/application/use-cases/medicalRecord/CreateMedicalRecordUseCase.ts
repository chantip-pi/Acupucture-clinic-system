import { CreateMedicalRecordDTO } from "~/application/dtos/MedicalRecordDTO";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";

export class CreateMedicalRecordUseCase {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(dto: CreateMedicalRecordDTO): Promise<void> {
    await this.medicalRecordRepository.create(dto);
  }
}
