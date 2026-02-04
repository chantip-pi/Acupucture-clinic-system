import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { Appointment } from "~/domain/entities/Appointment";

export class GetAppointmentListByPatientIdUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(id: number): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getListByPatientId(id)
    if (!appointments) return [];
    return appointments;
  }
}

