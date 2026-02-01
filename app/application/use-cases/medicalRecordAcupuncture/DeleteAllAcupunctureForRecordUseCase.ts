import { IMedicalRecordAcupunctureRepository } from "~/domain/repositories/IMedicalRecordAcupunctureRepository";

export class DeleteAllAcupunctureForRecordUseCase {
  constructor(
    private readonly medicalRecordAcupunctureRepository: IMedicalRecordAcupunctureRepository,
  ) {}
    async execute(recordId: number): Promise<void> {
        await this.medicalRecordAcupunctureRepository.deleteAllAcupunctureByRecordId(recordId);
    }
}