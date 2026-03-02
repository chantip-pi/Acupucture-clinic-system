import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { CreatePatientDTO } from "~/application/dtos/PatientDTO";
import { PatientValidationService } from "~/domain/services/PatientValidationService";

export class AddPatientUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(dto: CreatePatientDTO): Promise<void> {
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


    // Create patient
    await this.patientRepository.create(dto);
  }
}

