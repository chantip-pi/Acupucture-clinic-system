import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { Appointment } from "~/domain/entities/Appointment";

export class GetAppointmentListUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getAll();
    return appointments.sort((a, b) => a.appointmentId - b.appointmentId);
  }
}

