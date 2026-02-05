import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";

export class GetMedicalRecordListByPatientIdUseCase {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(patientId: number): Promise<MedicalRecord[] | null> {
    return this.medicalRecordRepository.getListByPatientId(patientId);
  }
}
