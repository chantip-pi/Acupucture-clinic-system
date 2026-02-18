import { MedicalRecordIllness } from "~/domain/entities/MedicalRecordIllness";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { MEDICAL_RECORD_ILLNESS_ENDPOINT } from "~/constants/api";

export class MedicalRecordIllnessDataSource {
  constructor(private readonly baseUrl: string = MEDICAL_RECORD_ILLNESS_ENDPOINT) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<MedicalRecordIllness[]> {
      const res = await fetch(this.baseUrl);
      return this.handleResponse<MedicalRecordIllness[]>(res);
    }
  
    async getByRecordId( recordId: number ): Promise<MedicalRecordIllness[]> {
      const res = await fetch(`${this.baseUrl}/${recordId}`, {
          method: "GET",
      });
      return this.handleResponse<MedicalRecordIllness[]>(res);
    }
  
    async create( recordId: number, medicalRecordIllness: Omit<MedicalRecordIllness, "recordId"> ): Promise<MedicalRecordIllness> {
      const res = await fetch(`${this.baseUrl}/${recordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicalRecordIllness),
      });
      return this.handleResponse<MedicalRecordIllness>(res);
    }
  
    async deleteAllIllnessByRecordId(recordId: number): Promise<void> {
      const res = await fetch(`${this.baseUrl}/${recordId}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(
          `Delete all illness by recordId failed: ${res.status} ${res.statusText}`,
        );
    }
  
    async delete(recordId: number, illnessId: number): Promise<void> {
      const res = await fetch(`${this.baseUrl}/${recordId}/${illnessId}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
    }
}