import { Patient } from "~/domain/entities/Patient";

export class PatientDataSource {
  constructor(private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/patients") {}
  // constructor(private readonly baseUrl: string = "http://localhost:3000/api/patients") {}


  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Patient[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Patient[]>(res);
  }

  async getById(patientId: number): Promise<Patient | null> {
    // Backend route: GET /api/patient/id/:patientId
    const res = await fetch(`${this.baseUrl}/${patientId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Patient>(res);
  }



  async create(patient: Omit<Patient, "patientId">): Promise<Patient> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });
    return this.handleResponse<Patient>(res);
  }

  async update(patient: Patient): Promise<Patient> {
    const res = await fetch(`${this.baseUrl}/${patient.patientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });
    return this.handleResponse<Patient>(res);
  }

  async delete(patientId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${patientId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}

// optional default instance
export const patientDatasource = new PatientDataSource();