import { UpdateMedicalRecordDTO } from "~/application/dtos/MedicalRecordDTO";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";

export class UpdateMedicalRecordUseCase {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(dto: UpdateMedicalRecordDTO): Promise<void> {
    await this.medicalRecordRepository.update(dto);
  }
}
