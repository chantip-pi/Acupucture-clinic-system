import { IMedicalRecordAcupunctureRepository } from "~/domain/repositories/IMedicalRecordAcupunctureRepository";
import { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";

export class GetMedicalRecordAcupunctureListUseCase {
  constructor(
    private readonly medicalRecordAcupunctureRepository: IMedicalRecordAcupunctureRepository,
  ) {}

  async execute(): Promise<MedicalRecordAcupuncture[]> {
    return await this.medicalRecordAcupunctureRepository.getAll();
  }
}
