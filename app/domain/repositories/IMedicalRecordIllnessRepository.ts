import { MedicalRecordIllness } from "../entities/MedicalRecordIllness";

export interface IMedicalRecordIllnessRepository {
  getAll(): Promise<MedicalRecordIllness[]>;
  getByRecordId(recordId: number): Promise<MedicalRecordIllness[]>;
  create(recordId: number, medicalRecordIllness: Omit<MedicalRecordIllness, "recordId" | "illnessId">): Promise<MedicalRecordIllness>;
  delete(recordId: number, illnessId: number): Promise<void>;
  deleteAllIllnessByRecordId(recordId: number): Promise<void>;
}
