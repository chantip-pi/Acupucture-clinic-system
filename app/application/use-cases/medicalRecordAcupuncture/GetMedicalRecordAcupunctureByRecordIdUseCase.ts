import { IMedicalRecordAcupunctureRepository } from "~/domain/repositories/IMedicalRecordAcupunctureRepository";
import { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";

export class GetMedicalRecordAcupunctureByRecordIdUseCase {
  constructor(
    private readonly medicalRecordAcupunctureRepository: IMedicalRecordAcupunctureRepository,
  ) {}

    async execute(recordId: number): Promise<MedicalRecordAcupuncture | null> {
        return await this.medicalRecordAcupunctureRepository.getByRecordId(recordId);
    }
}