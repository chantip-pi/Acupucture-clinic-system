import { Appointment } from "~/domain/entities/Appointment";
import { APPOINTMENT_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class AppointmentDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = APPOINTMENT_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }

  async getAll(): Promise<Appointment[]> {
    return this.httpClient.get<Appointment[]>("");
  }

  async getById(appointmentId: number): Promise<Appointment | null> {
    try {
      return await this.httpClient.get<Appointment>(`/${appointmentId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getListByPatientId(patientId: number): Promise<Appointment[] | null> {
    try {
      return await this.httpClient.get<Appointment[]>(`/patient/${patientId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(appointment: Omit<Appointment, "appointmentId">): Promise<Appointment> {
    return this.httpClient.post<Appointment>("", appointment);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    return this.httpClient.put<Appointment>(`/${appointment.appointmentId}`, appointment);
  }

  async cancel(appointmentId: number): Promise<Appointment> {
    return this.httpClient.put<Appointment>(`/${appointmentId}`);
  }
}

// optional default instance
export const appointmentDatasource = new AppointmentDataSource();