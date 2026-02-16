import { CreateMedicalRecordDTO } from "~/application/dtos/MedicalRecordDTO";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";

export class CreateMedicalRecordUseCase {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(dto: CreateMedicalRecordDTO): Promise<MedicalRecord> {
    const medicalRecord: Omit<MedicalRecord, "recordId"> = {
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      appointmentId: dto.appointmentId,
      dateTime: dto.dateTime,
      symptoms: dto.symptoms,
      diagnosis: dto.diagnosis,
      prescriptions: dto.prescriptions,
      remarks: dto.remarks,
      assignees: dto.assignees,
    };
    return await this.medicalRecordRepository.create(medicalRecord);
  }
}