import { Staff } from "../entities/Staff";
import { StaffNameDTO } from "../../application/dtos/StaffDTO";

export interface IStaffRepository {
  getAll(): Promise<Staff[]>;
  getById(id: number): Promise<Staff | null>;
  getByUsername(username: string): Promise<Staff | null>;
  login(username: string, password: string): Promise<Staff | null>;
  create(staff: Omit<Staff, "staffId">): Promise<Staff>;
  update(staff: Staff): Promise<Staff>;
  delete(staffId: number): Promise<void>;
  getDoctors(): Promise<StaffNameDTO[]>;
  getStaffs(): Promise<StaffNameDTO[]>;
}

