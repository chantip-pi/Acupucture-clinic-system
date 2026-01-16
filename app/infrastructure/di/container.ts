// ===== Domain Interfaces =====
import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";

// ===== Application Use Cases =====
// Patient
import { AddPatientUseCase } from "~/application/use-cases/patient/AddPatientUseCase";
import { GetPatientListUseCase } from "~/application/use-cases/patient/GetPatientListUseCase";
import { GetPatientByIdUseCase } from "~/application/use-cases/patient/GetPatientByIdUseCase";
import { UpdatePatientUseCase } from "~/application/use-cases/patient/UpdatePatientUseCase";

// Staff
import { AddStaffUseCase } from "~/application/use-cases/staff/AddStaffUseCase";
import { LoginUseCase } from "~/application/use-cases/staff/LoginUseCase";
import { GetStaffListUseCase } from "~/application/use-cases/staff/GetStaffListUseCase";
import { GetStaffByUsernameUseCase } from "~/application/use-cases/staff/GetStaffByUsernameUseCase";
import { UpdateStaffUseCase } from "~/application/use-cases/staff/UpdateStaffUseCase";
import { DeleteStaffUseCase } from "~/application/use-cases/staff/DeleteStaffUseCase";

import { DeletePatientUseCase } from "~/application/use-cases/patient/DeletePatientUseCase";


// ===== Data Sources =====
import { MockDataSource } from "../datasource/MockDataSource";
import { PatientDataSource } from "../datasource/PatientDataSource";
import { StaffDataSource } from "../datasource/StaffDataSource";
import { AppointmentDataSource } from "../datasource/AppointmentDatasource";

// ===== Repositories (Infrastructure) =====
import { PatientRepository } from "../repositories/PatientRepository";
import { StaffRepository } from "../repositories/StaffRepository";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { GetAppointmentByDoctorIdUseCase } from "~/application/use-cases/appointment/GetAppointmentByDoctorIdUseCase";
import { GetAppointmentListUseCase } from "~/application/use-cases/appointment/GetAppointmentListUseCase";


// Initialize repositories based on datasource configuration
let patientRepository: IPatientRepository;
let staffRepository: IStaffRepository;
let appointmentRepository: IAppointmentRepository;

const mockDataSource = MockDataSource.getInstance();
const staffDataSource = new StaffDataSource();
const patientDatasource = new PatientDataSource();
const appointmentDatasource = new AppointmentDataSource();
patientRepository = new PatientRepository(patientDatasource);
staffRepository = new StaffRepository(staffDataSource);
appointmentRepository = new AppointmentRepository(appointmentDatasource);

// Use Cases
export const addPatientUseCase = new AddPatientUseCase(patientRepository);
export const getPatientListUseCase = new GetPatientListUseCase(patientRepository);
export const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
export const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
export const deletePatientUsecase = new DeletePatientUseCase(patientRepository);


export const loginUseCase = new LoginUseCase(staffRepository);
export const getStaffListUseCase = new GetStaffListUseCase(staffRepository);
export const getStaffByUsernameUseCase = new GetStaffByUsernameUseCase(staffRepository);
export const addStaffUseCase = new AddStaffUseCase(staffRepository);
export const updateStaffUseCase = new UpdateStaffUseCase(staffRepository);
export const deleteStaffUsecase = new DeleteStaffUseCase(staffRepository);

export const getAppointmentListUseCase = new GetAppointmentListUseCase(appointmentRepository);
export const getAppointmentByDoctorIdUseCase = new GetAppointmentByDoctorIdUseCase(appointmentRepository);

