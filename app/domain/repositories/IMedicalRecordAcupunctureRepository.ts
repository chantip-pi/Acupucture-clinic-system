import { MedicalRecordAcupuncture } from "../entities/MedicalRecordAcupuncture";

export interface IMedicalRecordAcupunctureRepository {
  getAll(): Promise<MedicalRecordAcupuncture[]>;
  getByRecordId(recordId: number): Promise<MedicalRecordAcupuncture[]>;
  create(recordId: number, medicalRecordAcupuncture: Omit<MedicalRecordAcupuncture, "recordId" | "acupunctureId">): Promise<MedicalRecordAcupuncture>;
  delete(recordId: number, acupunctureId: number): Promise<void>;
  deleteAllAcupunctureByRecordId(recordId: number): Promise<void>;
}
