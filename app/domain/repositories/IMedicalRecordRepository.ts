import { MedicalRecord } from "../entities/MedicalRecord";

export interface IMedicalRecordRepository {
  getAll(): Promise<MedicalRecord[]>;
  getListByPatientId(id: number): Promise<MedicalRecord[] | null>;
  getById(id: number): Promise<MedicalRecord | null>;
  create(appointment: Omit<MedicalRecord, "recordId">): Promise<MedicalRecord>;
  update(appointment: MedicalRecord): Promise<MedicalRecord>;
}