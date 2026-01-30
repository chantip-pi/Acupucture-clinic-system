// ===== Domain Interfaces =====
import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";
import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";
import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";

//repositories
import { PatientRepository } from "../repositories/PatientRepository";
import { StaffRepository } from "../repositories/StaffRepository";
import { AcupointRepository } from "../repositories/AcupointRepository";
import { AcupointLocationRepository } from "../repositories/AcupointLocationRepository";
import { AcupunctureRepository } from "../repositories/AcupunctureRepository";
import { IllnessRepository } from "../repositories/IllnessRepository";
import { MeridianRepository } from "../repositories/MeridianRepository";

//datasources
import { MockDataSource } from "../datasource/MockDataSource";
import { PatientDataSource } from "../datasource/PatientDataSource";
import { StaffDataSource } from "../datasource/StaffDataSource";
import { AcupointDataSource } from "../datasource/AcupointDataSource";
import { AcupointLocationDataSource } from "../datasource/AcupointLocationDataSource";
import { AcupunctureDataSource } from "../datasource/AcupunctureDataSource";
import { IllnessDataSource } from "../datasource/IllnessDataSource";
import { MeridianDataSource } from "../datasource/MeridianDataSource";

//patient use cases
import { AddPatientUseCase } from "~/application/use-cases/patient/AddPatientUseCase";
import { GetPatientListUseCase } from "~/application/use-cases/patient/GetPatientListUseCase";
import { GetPatientByIdUseCase } from "~/application/use-cases/patient/GetPatientByIdUseCase";
import { UpdatePatientUseCase } from "~/application/use-cases/patient/UpdatePatientUseCase";
import { DeletePatientUseCase } from "~/application/use-cases/patient/DeletePatientUseCase";

//staff use cases
import { AddStaffUseCase } from "~/application/use-cases/staff/AddStaffUseCase";
import { LoginUseCase } from "~/application/use-cases/staff/LoginUseCase";
import { GetStaffListUseCase } from "~/application/use-cases/staff/GetStaffListUseCase";
import { GetStaffByUsernameUseCase } from "~/application/use-cases/staff/GetStaffByUsernameUseCase";
import { UpdateStaffUseCase } from "~/application/use-cases/staff/UpdateStaffUseCase";
import { DeleteStaffUseCase } from "~/application/use-cases/staff/DeleteStaffUseCase";

//acupoint use cases
import { AddAcupointUseCase } from "~/application/use-cases/acupoint/AddAcupointUseCase";
import { GetAcupointListUseCase } from "~/application/use-cases/acupoint/GetAcupointListUseCase";
import { GetAcupointByCodeUseCase } from "~/application/use-cases/acupoint/GetAcupointByCodeUseCase";
import { UpdateAcupointUseCase } from "~/application/use-cases/acupoint/UpdateAcupointUseCase";
import { DeleteAcupointUseCase } from "~/application/use-cases/acupoint/DeleteAcupointUseCase";

//acupoint location use cases
import { AddAcupointLocationUseCase } from "~/application/use-cases/acupointLocation/AddAcupointLocationUseCase";
import { GetAcupointLocationListUseCase } from "~/application/use-cases/acupointLocation/GetAcupointLocationListUseCase";
import { GetAcupointLocationByIdUseCase } from "~/application/use-cases/acupointLocation/GetAcupointLocationByIdUseCase";
import { UpdateAcupointLocationUseCase } from "~/application/use-cases/acupointLocation/UpdateAcupointLocationUseCase";
import { DeleteAcupointLocationUseCase } from "~/application/use-cases/acupointLocation/DeleteAcupointLocationUseCase";

//acupuncture use cases
import { AddAcupunctureUseCase } from "~/application/use-cases/acupuncture/AddAcupunctureUseCase";
import { GetAcupunctureListUseCase } from "~/application/use-cases/acupuncture/GetAcupunctureListUseCase";
import { GetAcupunctureByIdUseCase } from "~/application/use-cases/acupuncture/GetAcupunctureByIdUseCase";
import { UpdateAcupunctureUseCase } from "~/application/use-cases/acupuncture/UpdateAcupunctureUseCase";
import { DeleteAcupunctureUseCase } from "~/application/use-cases/acupuncture/DeleteAcupunctureUseCase";

//illness use cases
import { AddIllnessUseCase } from "~/application/use-cases/illness/AddIllnessUseCase";
import { GetIllnessListUseCase } from "~/application/use-cases/illness/GetIllnessListUseCase";
import { GetIllnessByIdUseCase } from "~/application/use-cases/illness/GetIllnessByIdUseCase";
import { UpdateIllnessUseCase } from "~/application/use-cases/illness/UpdateIllnessUseCase";
import { DeleteIllnessUseCase } from "~/application/use-cases/illness/DeleteIllnessUseCase";

//meridian use cases
import { AddMeridianUseCase } from "~/application/use-cases/meridian/AddMeridianUseCase";
import { GetMeridianListUseCase } from "~/application/use-cases/meridian/GetMeridianListUseCase";
import { GetMeridianByIdUseCase } from "~/application/use-cases/meridian/GetMeridianByIdUseCase";
import { UpdateMeridianUseCase } from "~/application/use-cases/meridian/UpdateMeridianUseCase";
import { DeleteMeridianUseCase } from "~/application/use-cases/meridian/DeleteMeridianUseCase";


// Initialize repositories based on datasource configuration
let patientRepository: IPatientRepository;
let staffRepository: IStaffRepository;
let acupointRepository: IAcupointRepository;
let acupointLocationRepository: IAcupointLocationRepository;
let acupunctureRepository: IAcupunctureRepository;
let illnessRepository: IIllnessRepository;
let meridianRepository: IMeridianRepository;

// DataSources
const mockDataSource = MockDataSource.getInstance();
const staffDataSource = new StaffDataSource();
const patientDatasource = new PatientDataSource();
const acupointDataSource = new AcupointDataSource();
const acupointLocationDataSource = new AcupointLocationDataSource();
const acupunctureDataSource = new AcupunctureDataSource();
const illnessDataSource = new IllnessDataSource();
const meridianDataSource = new MeridianDataSource();

// Repositories
patientRepository = new PatientRepository(patientDatasource);
staffRepository = new StaffRepository(staffDataSource);
acupointRepository = new AcupointRepository(acupointDataSource);
acupointLocationRepository = new AcupointLocationRepository(acupointLocationDataSource);
acupunctureRepository = new AcupunctureRepository(acupunctureDataSource);
illnessRepository = new IllnessRepository(illnessDataSource);
meridianRepository = new MeridianRepository(meridianDataSource);

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
export const updateMeridianUseCase = new UpdateMeridianUseCase(meridianRepository);
export const deleteMeridianUsecase = new DeleteMeridianUseCase(meridianRepository);

