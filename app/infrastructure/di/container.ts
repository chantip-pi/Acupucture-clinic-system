
import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { PatientRepository } from "../repositories/PatientRepository";
import { StaffRepository } from "../repositories/StaffRepository";
import { MockDataSource } from "../datasource/MockDataSource";
import { StaffDataSource } from "../datasource/StaffDataSource";
import { AddPatientUseCase } from "~/application/use-cases/patient/AddPatientUseCase";
import { AddStaffUseCase } from "~/application/use-cases/staff/AddStaffUseCase";
import { GetPatientListUseCase } from "~/application/use-cases/patient/GetPatientListUseCase";
import { GetPatientByIdUseCase } from "~/application/use-cases/patient/GetPatientByIdUseCase";
import { UpdatePatientUseCase } from "~/application/use-cases/patient/UpdatePatientUseCase";
import { LoginUseCase } from "~/application/use-cases/staff/LoginUseCase";
import { GetStaffListUseCase } from "~/application/use-cases/staff/GetStaffListUseCase";
import { GetStaffByUsernameUseCase } from "~/application/use-cases/staff/GetStaffByUsernameUseCase";
import { UpdateStaffUseCase } from "~/application/use-cases/staff/UpdateStaffUseCase";
import { DeleteStaffUseCase } from "~/application/use-cases/staff/DeleteStaffUseCase";
import { DeletePatientUseCase } from "~/application/use-cases/patient/DeletePatientUseCase";
import { PatientDataSource } from "../datasource/PatientDataSource";
// Initialize repositories based on datasource configuration
let patientRepository: IPatientRepository;
let staffRepository: IStaffRepository;

const mockDataSource = MockDataSource.getInstance();
const staffDataSource = new StaffDataSource();
const patientDatasource = new PatientDataSource();

patientRepository = new PatientRepository(patientDatasource);
staffRepository = new StaffRepository(staffDataSource);

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


