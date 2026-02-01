import { IMedicalRecordAcupunctureRepository } from "~/domain/repositories/IMedicalRecordAcupunctureRepository";
import { CreateMedicalRecordAcupunctureDTO } from "~/application/dtos/MedicalRecordAcupunctureDTO";

export class AddMedicalRecordAcupunctureUseCase {
  constructor(
    private readonly medicalRecordAcupunctureRepository: IMedicalRecordAcupunctureRepository,
  ) {}

  async execute(dto: CreateMedicalRecordAcupunctureDTO): Promise<void> {
    const allRecords = await this.medicalRecordAcupunctureRepository.getAll();
    
    const isDuplicate = allRecords.some(
      record => record.recordId === dto.recordId && record.acupunctureId === dto.acupunctureId
    );

    if (isDuplicate) {
      throw new Error("This acupuncture is already added to this medical record.");
    }
    await this.medicalRecordAcupunctureRepository.create(dto.recordId, dto);
  }
}
