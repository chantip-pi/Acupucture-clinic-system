import { Appointment } from "../entities/Appointment";

export interface IAppointmentRepository {
  getAll(): Promise<Appointment[]>;
  getListByPatientId(id: number): Promise<Appointment[] | null>;
  getById(id: number): Promise<Appointment | null>;


  create(appointment: Omit<Appointment, "appointmentId">): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
  cancel(appointment: Appointment): Promise<Appointment>;
}

