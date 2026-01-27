import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { UpdateAppointmentDTO } from "~/application/dtos/AppointmentDTO";

export class CancelAppointmentUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(dto: UpdateAppointmentDTO): Promise<void> {

    await this.appointmentRepository.cancel(dto);
  }
}

