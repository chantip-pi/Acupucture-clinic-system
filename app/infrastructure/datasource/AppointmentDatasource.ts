import { Appointment } from "~/domain/entities/Appointment";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { APPOINTMENT_ENDPOINT } from "~/constants/api";

export class AppointmentDataSource {
  constructor(private readonly baseUrl: string = APPOINTMENT_ENDPOINT) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      await BackendErrorService.handleErrorResponse(res);
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Appointment[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Appointment[]>(res);
  }


  async getById(appointmentId: number): Promise<Appointment | null> {
    const res = await fetch(`${this.baseUrl}/${appointmentId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Appointment>(res);
  }


  async getListByPatientId(patientId: number): Promise<Appointment[] | null> {
    const res = await fetch(`${this.baseUrl}/patient/${patientId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Appointment[]>(res);
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

  async cancel(appointmentId: number): Promise<Appointment> {
    const res = await fetch(`${this.baseUrl}/${appointmentId}`, {
      method: "PUT",
    });
    if (!res.ok) {
      await BackendErrorService.handleErrorResponse(res);
    }
    return this.handleResponse<Appointment>(res);

  }

}

// optional default instance
export const appointmentDatasource = new AppointmentDataSource();