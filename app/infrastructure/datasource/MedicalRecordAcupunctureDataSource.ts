import { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";
import { MEDICAL_RECORD_ACUPUNCTURE_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class MedicalRecordAcupunctureDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = MEDICAL_RECORD_ACUPUNCTURE_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async getAll(): Promise<MedicalRecordAcupuncture[]> {
    return this.httpClient.get<MedicalRecordAcupuncture[]>("");
  }

  async getByRecordId(recordId: number): Promise<MedicalRecordAcupuncture[]> {
    return this.httpClient.get<MedicalRecordAcupuncture[]>(`/${recordId}`);
  }

  async create(recordId: number, medicalRecordAcupuncture: Omit<MedicalRecordAcupuncture, "recordId">): Promise<MedicalRecordAcupuncture> {
    return this.httpClient.post<MedicalRecordAcupuncture>(`/${recordId}`, medicalRecordAcupuncture);
  }

  async deleteAllAcupunctureByRecordId(recordId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${recordId}`);
  }

  async delete(recordId: number, acupunctureId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${recordId}/${acupunctureId}`);
  }
}
