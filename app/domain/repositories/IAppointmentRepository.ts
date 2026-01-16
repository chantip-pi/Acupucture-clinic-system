import { Appointment } from "../entities/Appointment";

export interface IAppointmentRepository {
  getAll(): Promise<Appointment[]>;
  getByPatientId(id: number): Promise<Appointment | null>;
  getByDoctorId(id: number): Promise<Appointment | null>;

  create(appointment: Omit<Appointment, "appointmentId">): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
}

