import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { LoginDTO } from "~/application/dtos/StaffDTO";
import { Staff } from "~/domain/entities/Staff";

export class LoginUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(dto: LoginDTO): Promise<Staff | null> {
    const staff = await this.staffRepository.login(dto.username, dto.password);
    return staff;
  }
}

