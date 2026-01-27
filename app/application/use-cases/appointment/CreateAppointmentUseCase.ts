import { CreateAppointmentDTO } from "~/application/dtos/AppointmentDTO";
import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";

export class CreateAppointmentUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(dto: CreateAppointmentDTO): Promise<void> {

    await this.appointmentRepository.create(dto);
  }
}

