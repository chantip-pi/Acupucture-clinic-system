import { MedicalRecordIllness } from "~/domain/entities/MedicalRecordIllness";
import { MEDICAL_RECORD_ILLNESS_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class MedicalRecordIllnessDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = MEDICAL_RECORD_ILLNESS_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }

  async getAll(): Promise<MedicalRecordIllness[]> {
    return this.httpClient.get<MedicalRecordIllness[]>("");
  }
  
  async getByRecordId(recordId: number): Promise<MedicalRecordIllness[]> {
    return this.httpClient.get<MedicalRecordIllness[]>(`/${recordId}`);
  }
  
  async create(recordId: number, medicalRecordIllness: Omit<MedicalRecordIllness, "recordId">): Promise<MedicalRecordIllness> {
    return this.httpClient.post<MedicalRecordIllness>(`/${recordId}`, medicalRecordIllness);
  }
  
  async deleteAllIllnessByRecordId(recordId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${recordId}`);
  }
  
  async delete(recordId: number, illnessId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${recordId}/${illnessId}`);
  }
}