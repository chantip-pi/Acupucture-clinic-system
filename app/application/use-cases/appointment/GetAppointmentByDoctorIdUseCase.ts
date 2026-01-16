import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { Appointment } from "~/domain/entities/Appointment";

export class GetAppointmentByDoctorIdUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(id: number): Promise<Appointment | null> {
    return await this.appointmentRepository.getByDoctorId(id);
  }
}

