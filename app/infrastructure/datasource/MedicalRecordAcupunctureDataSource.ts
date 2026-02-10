import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";

export class MedicalRecordAcupunctureDataSource {
//   constructor( private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/medicalRecordAcupunctures") {}

  constructor(private readonly baseUrl: string = "http://localhost:3000/api/medicalRecordAcupunctures") {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<MedicalRecordAcupuncture[]> {
    const res = await fetch(this.baseUrl);
    return this.handleResponse<MedicalRecordAcupuncture[]>(res);
  }

  async getByRecordId( recordId: number ): Promise<MedicalRecordAcupuncture[]> {
    const res = await fetch(`${this.baseUrl}/${recordId}`, {
        method: "GET",
    });
    return this.handleResponse<MedicalRecordAcupuncture[]>(res);
  }

  async create( recordId: number, medicalRecordAcupuncture: Omit<MedicalRecordAcupuncture, "recordId"> ): Promise<MedicalRecordAcupuncture> {
    const res = await fetch(`${this.baseUrl}/${recordId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medicalRecordAcupuncture),
    });
    return this.handleResponse<MedicalRecordAcupuncture>(res);
  }

  async deleteAllAcupunctureByRecordId(recordId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${recordId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(
        `Delete all acupuncture by recordId failed: ${res.status} ${res.statusText}`,
      );
  }

  async delete(recordId: number, acupunctureId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${recordId}/${acupunctureId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
