// ===== Domain Interfaces =====
import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";
import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";
import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { IMedicalRecordAcupunctureRepository } from "~/domain/repositories/IMedicalRecordAcupunctureRepository";
import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";
import { IIllnessAcupunctureRepository } from "~/domain/repositories/IIllnessAcupunctureRepository";
import { IMedicalRecordIllnessRepository } from "~/domain/repositories/IMedicalRecordIllnessRepository";

// ===== Application Use Cases =====
// Patient
import { AddPatientUseCase } from "~/application/use-cases/patient/AddPatientUseCase";
import { GetPatientListUseCase } from "~/application/use-cases/patient/GetPatientListUseCase";
import { GetPatientByIdUseCase } from "~/application/use-cases/patient/GetPatientByIdUseCase";
import { UpdatePatientUseCase } from "~/application/use-cases/patient/UpdatePatientUseCase";
import { DeletePatientUseCase } from "~/application/use-cases/patient/DeletePatientUseCase";

// Staff
import { AddStaffUseCase } from "~/application/use-cases/staff/AddStaffUseCase";
import { LoginUseCase } from "~/application/use-cases/staff/LoginUseCase";
import { GetStaffListUseCase } from "~/application/use-cases/staff/GetStaffListUseCase";
import { GetStaffByUsernameUseCase } from "~/application/use-cases/staff/GetStaffByUsernameUseCase";
import { UpdateStaffUseCase } from "~/application/use-cases/staff/UpdateStaffUseCase";
import { DeleteStaffUseCase } from "~/application/use-cases/staff/DeleteStaffUseCase";

// Acupoint
import { AddAcupointUseCase } from "~/application/use-cases/acupoint/AddAcupointUseCase";
import { GetAcupointListUseCase } from "~/application/use-cases/acupoint/GetAcupointListUseCase";
import { GetAcupointByCodeUseCase } from "~/application/use-cases/acupoint/GetAcupointByCodeUseCase";
import { UpdateAcupointUseCase } from "~/application/use-cases/acupoint/UpdateAcupointUseCase";
import { DeleteAcupointUseCase } from "~/application/use-cases/acupoint/DeleteAcupointUseCase";

// Acupoint Location
import { AddAcupointLocationUseCase } from "~/application/use-cases/acupointLocation/AddAcupointLocationUseCase";
import { GetAcupointLocationListUseCase } from "~/application/use-cases/acupointLocation/GetAcupointLocationListUseCase";
import { GetAcupointLocationByIdUseCase } from "~/application/use-cases/acupointLocation/GetAcupointLocationByIdUseCase";
import { UpdateAcupointLocationUseCase } from "~/application/use-cases/acupointLocation/UpdateAcupointLocationUseCase";
import { DeleteAcupointLocationUseCase } from "~/application/use-cases/acupointLocation/DeleteAcupointLocationUseCase";

// Acupuncture
import { AddAcupunctureUseCase } from "~/application/use-cases/acupuncture/AddAcupunctureUseCase";
import { GetAcupunctureListUseCase } from "~/application/use-cases/acupuncture/GetAcupunctureListUseCase";
import { GetAcupunctureByIdUseCase } from "~/application/use-cases/acupuncture/GetAcupunctureByIdUseCase";
import { GetAcupunctureByMeridianIdUseCase } from "~/application/use-cases/acupuncture/GetAcupunctureByMeridianIdUseCase";
import { GetAcupunctureByRegionAndSideUseCase } from "~/application/use-cases/acupuncture/GetAcupunctureByRegionAndSideUseCase";
import { UpdateAcupunctureUseCase } from "~/application/use-cases/acupuncture/UpdateAcupunctureUseCase";
import { DeleteAcupunctureUseCase } from "~/application/use-cases/acupuncture/DeleteAcupunctureUseCase";

// Illness
import { AddIllnessUseCase } from "~/application/use-cases/illness/AddIllnessUseCase";
import { GetIllnessListUseCase } from "~/application/use-cases/illness/GetIllnessListUseCase";
import { GetIllnessByIdUseCase } from "~/application/use-cases/illness/GetIllnessByIdUseCase";
import { UpdateIllnessUseCase } from "~/application/use-cases/illness/UpdateIllnessUseCase";
import { DeleteIllnessUseCase } from "~/application/use-cases/illness/DeleteIllnessUseCase";

// Meridian
import { AddMeridianUseCase } from "~/application/use-cases/meridian/AddMeridianUseCase";
import { GetMeridianListUseCase } from "~/application/use-cases/meridian/GetMeridianListUseCase";
import { GetMeridianByIdUseCase } from "~/application/use-cases/meridian/GetMeridianByIdUseCase";
import { GetMeridiansByRegionAndSideUseCase } from "~/application/use-cases/meridian/GetMeridiansByRegionAndSideUseCase";
import { UpdateMeridianUseCase } from "~/application/use-cases/meridian/UpdateMeridianUseCase";
import { DeleteMeridianUseCase } from "~/application/use-cases/meridian/DeleteMeridianUseCase";
import { GetMeridianRegionUseCase } from "~/application/use-cases/meridian/GetMeridianRegionUseCase";
import { GetMeridianSideByRegionUseCase } from "~/application/use-cases/meridian/GetMeridianSideByRegionUseCase";

// Medical Record
import { CreateMedicalRecordUseCase } from "~/application/use-cases/medicalRecord/CreateMedicalRecordUseCase";
import { GetMedicalRecordListUseCase } from "~/application/use-cases/medicalRecord/GetMedicalRecordListUseCase";
import { GetMedicalRecordByIdUseCase } from "~/application/use-cases/medicalRecord/GetMedicalRecordByIdUseCase";
import { GetMedicalRecordListByPatientIdUseCase } from "~/application/use-cases/medicalRecord/GetMedicalRecordListByPatientIdUseCase";
import { UpdateMedicalRecordUseCase } from "~/application/use-cases/medicalRecord/UpdateMedicalRecordUseCase";

// Medical Record Acupuncture
import { AddMedicalRecordAcupunctureUseCase } from "~/application/use-cases/medicalRecordAcupuncture/AddMedicalRecordAcupunctureUseCase";
import { GetMedicalRecordAcupunctureListUseCase } from "~/application/use-cases/medicalRecordAcupuncture/GetMedicalRecordAcupunctureListUseCase";
import { GetMedicalRecordAcupunctureByRecordIdUseCase } from "~/application/use-cases/medicalRecordAcupuncture/GetMedicalRecordAcupunctureByRecordIdUseCase";
import { DeleteAllAcupunctureForRecordUseCase } from "~/application/use-cases/medicalRecordAcupuncture/DeleteAllAcupunctureForRecordUseCase";
import { DeleteMedicalRecordAcupunctureUseCase } from "~/application/use-cases/medicalRecordAcupuncture/DeleteMedicalRecordAcupunctureUseCase";

// Illness Acupuncture
import { AddIllnessAcupunctureUseCase } from "~/application/use-cases/illnessAcupuncture/AddIllnessAcupunctureUseCase";
import { GetIllnessAcupunctureByIdUseCase } from "~/application/use-cases/illnessAcupuncture/GetIllnessAcupunctureByIdUseCase";
import { GetIllnessAcupunctureListUseCase } from "~/application/use-cases/illnessAcupuncture/GetIllnessAcupunctureListUseCase";
import { DeleteIllnessAcupunctureUseCase } from "~/application/use-cases/illnessAcupuncture/DeleteIllnessAcupunctureUseCase";
import { DeleteAllAcupunctureForIllnessUseCase } from "~/application/use-cases/illnessAcupuncture/DeleteAllAcupunctureForIllnessUseCase";

// Medical Record Illness
import { AddMedicalRecordIllnessUseCase } from "~/application/use-cases/medicalRecordIllness/AddMedicalRecordIllnessUseCase";
import { GetMedicalRecordIllnessByRecordIdUseCase } from "~/application/use-cases/medicalRecordIllness/GetMedicalRecordIllnessByRecordIdUseCase";
import { GetMedicalRecordIllnessListUseCase } from "~/application/use-cases/medicalRecordIllness/GetMedicalRecordIllnessListUseCase";
import { DeleteMedicalRecordIllnessUseCase } from "~/application/use-cases/medicalRecordIllness/DeleteMedicalRecordIllnessUseCase";
import { DeleteAllIllnessForRecordUseCase } from "~/application/use-cases/medicalRecordIllness/DeleteAllIllnessForRecordUseCase";

// ===== Data Sources =====
import { MockDataSource } from "../datasource/MockDataSource";
import { PatientDataSource } from "../datasource/PatientDataSource";
import { StaffDataSource } from "../datasource/StaffDataSource";
import { AcupointDataSource } from "../datasource/AcupointDataSource";
import { AcupointLocationDataSource } from "../datasource/AcupointLocationDataSource";
import { AcupunctureDataSource } from "../datasource/AcupunctureDataSource";
import { IllnessDataSource } from "../datasource/IllnessDataSource";
import { MeridianDataSource } from "../datasource/MeridianDataSource";
import { AppointmentDataSource } from "../datasource/AppointmentDatasource";
import { MedicalRecordAcupunctureDataSource } from "../datasource/MedicalRecordAcupunctureDataSource";
import { IllnessAcupunctureDataSource } from "../datasource/IllnessAcupunctureDataSource";
import { MedicalRecordIllnessDataSource } from "../datasource/MedicalRecordIllnessDataSource";

// ===== Repositories (Infrastructure) =====
import { PatientRepository } from "../repositories/PatientRepository";
import { StaffRepository } from "../repositories/StaffRepository";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { GetAppointmentListUseCase } from "~/application/use-cases/appointment/GetAppointmentListUseCase";
import { CreateAppointmentUseCase } from "~/application/use-cases/appointment/CreateAppointmentUseCase";
import { GetAppointmentListByPatientIdUseCase } from "~/application/use-cases/appointment/GetAppointmentListByPatientId"; 
import { GetAppointmentByIdUseCase } from "~/application/use-cases/appointment/GetAppointmentByIdUseCase"; 
import { UpdateAppointmentUseCase } from "~/application/use-cases/appointment/UpdateAppointmentUseCase"; 
import { CancelAppointmentUseCase } from "~/application/use-cases/appointment/CancelAppointmentUseCase"; 
import { AcupointRepository } from "../repositories/AcupointRepository";
import { AcupointLocationRepository } from "../repositories/AcupointLocationRepository";
import { AcupunctureRepository } from "../repositories/AcupunctureRepository";
import { IllnessRepository } from "../repositories/IllnessRepository";
import { MeridianRepository } from "../repositories/MeridianRepository";
import { MedicalRecordAcupunctureRepository } from "../repositories/MedicalRecordAcupunctureRepository";
import { MedicalRecordDataSource } from "../datasource/MedicalRecordDatasource";
import { MedicalRecordRepository } from "../repositories/MedicalRecordRepository";
import { IllnessAcupunctureRepository } from "../repositories/IllnessAcupunctureRepository";
import { MedicalRecordIllnessRepository } from "../repositories/MedicalRecordIllnessRepository";


import { GetSuggestUseCase } from "~/application/use-cases/gemini/GetSuggestUseCase";
// Initialize repositories based on datasource configuration
let patientRepository: IPatientRepository;
let staffRepository: IStaffRepository;
let appointmentRepository: IAppointmentRepository;
let acupointRepository: IAcupointRepository;
let acupointLocationRepository: IAcupointLocationRepository;
let acupunctureRepository: IAcupunctureRepository;
let illnessRepository: IIllnessRepository;
let meridianRepository: IMeridianRepository;
let medicalRecordAcupunctureRepository: IMedicalRecordAcupunctureRepository;
let medicalRecordRepository: IMedicalRecordRepository;
let illnessAcupunctureRepository: IIllnessAcupunctureRepository;
let medicalRecordIllnessRepository: IMedicalRecordIllnessRepository;

import { IGeminiRepository } from "~/domain/repositories/IGeminiRepository";
import { GeminiDataSource } from "../datasource/GeminiDataSource";
import { GeminiRepository } from "../repositories/GeminiRepository";
// Initialize repositories based on datasource configuration
let geminiRepository: IGeminiRepository;


// DataSources
const mockDataSource = MockDataSource.getInstance();
const staffDataSource = new StaffDataSource();
const patientDatasource = new PatientDataSource();
const acupointDataSource = new AcupointDataSource();
const acupointLocationDataSource = new AcupointLocationDataSource();
const acupunctureDataSource = new AcupunctureDataSource();
const illnessDataSource = new IllnessDataSource();
const meridianDataSource = new MeridianDataSource();
const medicalRecordAcupunctureDataSource = new MedicalRecordAcupunctureDataSource();
const illnessAcupunctureDataSource = new IllnessAcupunctureDataSource();
const geminiDatasource = new GeminiDataSource();
const medicalRecordIllnessDataSource = new MedicalRecordIllnessDataSource();

// Repositories
patientRepository = new PatientRepository(patientDatasource);
staffRepository = new StaffRepository(staffDataSource);
acupointRepository = new AcupointRepository(acupointDataSource);
acupointLocationRepository = new AcupointLocationRepository(acupointLocationDataSource);
acupunctureRepository = new AcupunctureRepository(acupunctureDataSource);
illnessRepository = new IllnessRepository(illnessDataSource);
meridianRepository = new MeridianRepository(meridianDataSource);
const appointmentDatasource = new AppointmentDataSource();
const medicalRecordDatasource = new MedicalRecordDataSource();
patientRepository = new PatientRepository(patientDatasource);
staffRepository = new StaffRepository(staffDataSource);
appointmentRepository = new AppointmentRepository(appointmentDatasource);
medicalRecordAcupunctureRepository = new MedicalRecordAcupunctureRepository(medicalRecordAcupunctureDataSource);
medicalRecordRepository = new MedicalRecordRepository(medicalRecordDatasource);
illnessAcupunctureRepository = new IllnessAcupunctureRepository(illnessAcupunctureDataSource);
geminiRepository = new GeminiRepository(geminiDatasource);
medicalRecordIllnessRepository = new MedicalRecordIllnessRepository(medicalRecordIllnessDataSource);


// Patient Use Cases
export const addPatientUseCase = new AddPatientUseCase(patientRepository);
export const getPatientListUseCase = new GetPatientListUseCase(patientRepository);
export const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
export const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
export const deletePatientUsecase = new DeletePatientUseCase(patientRepository);

// Staff Use Cases
export const loginUseCase = new LoginUseCase(staffRepository);
export const getStaffListUseCase = new GetStaffListUseCase(staffRepository);
export const getStaffByUsernameUseCase = new GetStaffByUsernameUseCase(staffRepository);
export const addStaffUseCase = new AddStaffUseCase(staffRepository);
export const updateStaffUseCase = new UpdateStaffUseCase(staffRepository);
export const deleteStaffUsecase = new DeleteStaffUseCase(staffRepository);

// Acupoint Use Cases
export const addAcupointUseCase = new AddAcupointUseCase(acupointRepository);
export const getAcupointListUseCase = new GetAcupointListUseCase(acupointRepository);
export const getAcupointByCodeUseCase = new GetAcupointByCodeUseCase(acupointRepository);
export const updateAcupointUseCase = new UpdateAcupointUseCase(acupointRepository);
export const deleteAcupointUsecase = new DeleteAcupointUseCase(acupointRepository);
export const getSuggestUseCase = new GetSuggestUseCase(geminiRepository);


// Acupoint Location Use Cases
export const addAcupointLocationUseCase = new AddAcupointLocationUseCase(acupointLocationRepository);
export const getAcupointLocationListUseCase = new GetAcupointLocationListUseCase(acupointLocationRepository);
export const getAcupointLocationByIdUseCase = new GetAcupointLocationByIdUseCase(acupointLocationRepository);
export const updateAcupointLocationUseCase = new UpdateAcupointLocationUseCase(acupointLocationRepository);
export const deleteAcupointLocationUsecase = new DeleteAcupointLocationUseCase(acupointLocationRepository);

// Acupuncture Use Cases
export const addAcupunctureUseCase = new AddAcupunctureUseCase(acupunctureRepository);
export const getAcupunctureListUseCase = new GetAcupunctureListUseCase(acupunctureRepository);
export const getAcupunctureByIdUseCase = new GetAcupunctureByIdUseCase(acupunctureRepository);
export const getAcupunctureByMeridianIdUseCase = new GetAcupunctureByMeridianIdUseCase(acupunctureRepository);
export const getAcupunctureByRegionAndSideUseCase = new GetAcupunctureByRegionAndSideUseCase(acupunctureRepository);
export const updateAcupunctureUseCase = new UpdateAcupunctureUseCase(acupunctureRepository);
export const deleteAcupunctureUsecase = new DeleteAcupunctureUseCase(acupunctureRepository);

// Illness Use Cases
export const addIllnessUseCase = new AddIllnessUseCase(illnessRepository);
export const getIllnessListUseCase = new GetIllnessListUseCase(illnessRepository);
export const getIllnessByIdUseCase = new GetIllnessByIdUseCase(illnessRepository);
export const updateIllnessUseCase = new UpdateIllnessUseCase(illnessRepository);
export const deleteIllnessUsecase = new DeleteIllnessUseCase(illnessRepository);

// Meridian Use Cases
export const addMeridianUseCase = new AddMeridianUseCase(meridianRepository);
export const getMeridianListUseCase = new GetMeridianListUseCase(meridianRepository);
export const getMeridianByIdUseCase = new GetMeridianByIdUseCase(meridianRepository);
export const getMeridiansByRegionAndSideUseCase = new GetMeridiansByRegionAndSideUseCase(meridianRepository);
export const getMeridianRegionUseCase = new GetMeridianRegionUseCase(meridianRepository);
export const getMeridianSideByRegionUseCase = new GetMeridianSideByRegionUseCase(meridianRepository);
export const updateMeridianUseCase = new UpdateMeridianUseCase(meridianRepository);
export const deleteMeridianUsecase = new DeleteMeridianUseCase(meridianRepository);

// Appointment Use Cases
export const getAppointmentListUseCase = new GetAppointmentListUseCase(appointmentRepository);
export const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentRepository);
export const getAppointmentListByPatientIdUseCase = new GetAppointmentListByPatientIdUseCase(appointmentRepository);
export const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentRepository);
export const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository);
export const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase(appointmentRepository);

// Medical Record Use Cases
export const createMedicalRecordUseCase = new CreateMedicalRecordUseCase(medicalRecordRepository);
export const getMedicalRecordListUseCase = new GetMedicalRecordListUseCase(medicalRecordRepository);
export const getMedicalRecordByIdUseCase = new GetMedicalRecordByIdUseCase(medicalRecordRepository);
export const getMedicalRecordListByPatientIdUseCase = new GetMedicalRecordListByPatientIdUseCase(medicalRecordRepository);
export const updateMedicalRecordUseCase = new UpdateMedicalRecordUseCase(medicalRecordRepository);

// Medical Record Acupuncture Use Cases
export const addMedicalRecordAcupunctureUseCase = new AddMedicalRecordAcupunctureUseCase(medicalRecordAcupunctureRepository);
export const getMedicalRecordAcupunctureListUseCase = new GetMedicalRecordAcupunctureListUseCase(medicalRecordAcupunctureRepository);
export const getMedicalRecordAcupunctureByRecordIdUseCase = new GetMedicalRecordAcupunctureByRecordIdUseCase(medicalRecordAcupunctureRepository);
export const deleteAllAcupunctureForRecordUseCase = new DeleteAllAcupunctureForRecordUseCase(medicalRecordAcupunctureRepository);
export const deleteMedicalRecordAcupunctureUseCase = new DeleteMedicalRecordAcupunctureUseCase(medicalRecordAcupunctureRepository);

// Illness Acupuncture Use Cases
export const addIllnessAcupunctureUseCase = new AddIllnessAcupunctureUseCase(illnessAcupunctureRepository);
export const getIllnessAcupunctureByIdUseCase = new GetIllnessAcupunctureByIdUseCase(illnessAcupunctureRepository);
export const getIllnessAcupunctureListUseCase = new GetIllnessAcupunctureListUseCase(illnessAcupunctureRepository);
export const deleteIllnessAcupunctureUseCase = new DeleteIllnessAcupunctureUseCase(illnessAcupunctureRepository);
export const deleteAllAcupunctureForIllnessUseCase = new DeleteAllAcupunctureForIllnessUseCase(illnessAcupunctureRepository);

// Medical Record Illness Use Cases
export const addMedicalRecordIllnessUseCase = new AddMedicalRecordIllnessUseCase(medicalRecordIllnessRepository);
export const getMedicalRecordIllnessByRecordIdUseCase = new GetMedicalRecordIllnessByRecordIdUseCase(medicalRecordIllnessRepository);
export const getMedicalRecordIllnessListUseCase = new GetMedicalRecordIllnessListUseCase(medicalRecordIllnessRepository);
export const deleteMedicalRecordIllnessUseCase = new DeleteMedicalRecordIllnessUseCase(medicalRecordIllnessRepository);
export const deleteAllIllnessForRecordUseCase = new DeleteAllIllnessForRecordUseCase(medicalRecordIllnessRepository);