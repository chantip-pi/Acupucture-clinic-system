import { Appointment } from "~/domain/entities/Appointment";

export class AppointmentDataSource {
  // constructor(private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/appointments") {}
  constructor(private readonly baseUrl: string = "http://localhost:3000/api/appointments") {}


  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Appointment[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Appointment[]>(res);
  }

  async getByDoctorId(doctorId: number): Promise<Appointment | null> {
    // Backend route: GET /api/appointment/id/:appointmentId
    const res = await fetch(`${this.baseUrl}/doctor/${doctorId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Appointment>(res);
  }

  async getByPatientId(patientId: number): Promise<Appointment | null> {
    const res = await fetch(`${this.baseUrl}/patient/${patientId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Appointment>(res);
  }


  async create(appointment: Omit<Appointment, "appointmentId">): Promise<Appointment> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
    return this.handleResponse<Appointment>(res);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const res = await fetch(`${this.baseUrl}/${appointment.appointmentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
    return this.handleResponse<Appointment>(res);
  }

}

// optional default instance
export const appointmentDatasource = new AppointmentDataSource();