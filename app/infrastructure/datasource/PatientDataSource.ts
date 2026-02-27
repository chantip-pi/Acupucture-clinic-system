import { Patient } from "~/domain/entities/Patient";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { PATIENT_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class PatientDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = PATIENT_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }

  async getAll(): Promise<Patient[]> {
    return await this.httpClient.get<Patient[]>("/");;
  }

  async getById(patientId: number): Promise<Patient | null> {
    return await this.httpClient.get<Patient>(`/${patientId}`);
  }

  async create(patient: Omit<Patient, "patientId">): Promise<Patient> {
    return await this.httpClient.post<Patient>("", patient);
  }

  async update(patient: Patient): Promise<Patient> {
    return await this.httpClient.put<Patient>(`/${patient.patientId}`, patient);
  }

  async delete(patientId: number): Promise<void> {
    return await this.httpClient.delete<void>(`/${patientId}`);
  }
}

// optional default instance
export const patientDatasource = new PatientDataSource();