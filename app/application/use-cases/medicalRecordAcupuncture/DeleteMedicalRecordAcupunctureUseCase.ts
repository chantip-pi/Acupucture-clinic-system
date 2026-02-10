import { IMedicalRecordAcupunctureRepository } from "~/domain/repositories/IMedicalRecordAcupunctureRepository";

export class DeleteMedicalRecordAcupunctureUseCase {
  constructor(
    private readonly medicalRecordAcupunctureRepository: IMedicalRecordAcupunctureRepository,
  ) {}
    async execute(recordId: number, acupunctureId: number): Promise<void> {
        await this.medicalRecordAcupunctureRepository.delete(recordId, acupunctureId);
    }
}