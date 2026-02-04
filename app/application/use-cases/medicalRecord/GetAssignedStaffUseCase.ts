import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";

export class GetAssignedStaffUseCase {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(medicalRecordId: number): Promise<StaffNameDTO[] | null> {
    return this.medicalRecordRepository.getAssignedStaff(medicalRecordId);
  }
}
