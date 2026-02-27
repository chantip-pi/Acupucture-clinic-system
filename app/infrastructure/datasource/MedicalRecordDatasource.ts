import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { MEDICAL_RECORD_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class MedicalRecordDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = MEDICAL_RECORD_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }

  async getAll(): Promise<MedicalRecord[]> {
    return this.httpClient.get<MedicalRecord[]>(""); // Removed trailing comma
  }

  async getById(medicalRecordId: number): Promise<MedicalRecord | null> {
    try {
      return await this.httpClient.get<MedicalRecord>(`/${medicalRecordId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getListByPatientId(patientId: number): Promise<MedicalRecord[] | null> {
    try {
      return await this.httpClient.get<MedicalRecord[]>(`/patient/${patientId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(medicalRecord: Omit<MedicalRecord, "medicalRecordId">): Promise<MedicalRecord> {
    return this.httpClient.post<MedicalRecord>("", medicalRecord);
  }

  async update(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
    return this.httpClient.put<MedicalRecord>(`/${medicalRecord.recordId}`, medicalRecord);
  }
}

// optional default instance
export const medicalRecordDatasource = new MedicalRecordDataSource();