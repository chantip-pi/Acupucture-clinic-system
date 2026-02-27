import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { Staff } from "~/domain/entities/Staff";
import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { StaffDataSource } from "../datasource/StaffDataSource";

/**
 */
export class StaffRepository implements IStaffRepository {
  constructor(private readonly dataSource: StaffDataSource) {}

  async getAll(): Promise<Staff[]> {
    return this.dataSource.getAll();
  }

  async getById(id: number): Promise<Staff | null> {
    return this.dataSource.getById(id);
  }

  async getByUsername(username: string): Promise<Staff | null> {
    return this.dataSource.getByUsername(username);
  }

  async login(username: string, password: string): Promise<Staff | null> {
    return this.dataSource.login(username,password);
  }

  async create(staff: Omit<Staff, "staffId">): Promise<Staff> {
    return this.dataSource.create(staff);
  }

  async update(staff: Staff): Promise<Staff> {
    return this.dataSource.update(staff);
  }

  async delete(staffId: number): Promise<void> {
    return this.dataSource.delete(staffId);
  }

  async getDoctors(): Promise<StaffNameDTO[]> {
    return this.dataSource.getDoctors();
  }

  async getStaffs(): Promise<StaffNameDTO[]> {
    return this.dataSource.getStaffs();
  }
}

