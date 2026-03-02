import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { UpdatePatientDTO } from "~/application/dtos/PatientDTO";
import { PatientValidationService } from "~/domain/services/PatientValidationService";

export class UpdatePatientUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(dto: UpdatePatientDTO): Promise<void> {
    // Validate input
    if (!PatientValidationService.validatePhoneNumber(dto.phoneNumber)) {
      throw new Error("Telephone number must be 10 digits.");
    }

    if (!PatientValidationService.validateBirthday(dto.birthday)) {
      throw new Error("Birthday cannot be in the future.");
    }

    if (!PatientValidationService.validateRemainingCourse(dto.remainingCourse)) {
      throw new Error("Course count cannot be negative.");
    }

    // Update patient
    await this.patientRepository.update(dto);
  }
}

