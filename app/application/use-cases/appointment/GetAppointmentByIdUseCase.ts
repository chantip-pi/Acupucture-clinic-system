import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { Appointment } from "~/domain/entities/Appointment";

export class GetAppointmentByIdUseCase {
    constructor(
      private readonly appointmentRepository: IAppointmentRepository
    ) {}
  
    async execute(id: number): Promise<Appointment | null> {
      const appointment = await this.appointmentRepository.getById(id);
      return appointment;
    }
  }
  

