import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { UpdateAppointmentDTO } from "~/application/dtos/AppointmentDTO";
import { AppointmentValidationService } from "~/domain/services/AppointmentValidationService";

export class UpdateAppointmentUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(dto: UpdateAppointmentDTO): Promise<void> {
    // Validate input
    if (!AppointmentValidationService.validateAppointmentDate(dto.appointmentDateTime)) {
      throw new Error("Date must not be in the past.");
    }

    await this.appointmentRepository.update(dto);
  }
}

