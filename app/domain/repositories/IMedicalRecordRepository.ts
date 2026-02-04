import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { MedicalRecord } from "../entities/MedicalRecord";
import { Staff } from "../entities/Staff";

export interface IMedicalRecordRepository {
  getAll(): Promise<MedicalRecord[]>;
  getListByPatientId(id: number): Promise<MedicalRecord[] | null>;
  getById(id: number): Promise<MedicalRecord | null>;


  create(appointment: Omit<MedicalRecord, "appointmentId">): Promise<MedicalRecord>;
  update(appointment: MedicalRecord): Promise<MedicalRecord>;

  getAssignedStaff(id: number): Promise<StaffNameDTO[] | null>;

}