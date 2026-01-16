import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { Appointment } from "~/domain/entities/Appointment";
import { AppointmentDataSource } from "../datasource/AppointmentDatasource";


export class AppointmentRepository implements IAppointmentRepository {
  constructor(private readonly dataSource: AppointmentDataSource) {}


  async getAll(): Promise<Appointment[]> {
    return this.dataSource.getAll();
  }


  async getByPatientId(id: number): Promise<Appointment | null> {
    return this.dataSource.getByPatientId(id);
  }

  async getByDoctorId(id: number): Promise<Appointment | null> {
    return this.dataSource.getByDoctorId(id);
  }


  async create(appointment: Omit<Appointment, "appointmentId">): Promise<Appointment> {
    return this.dataSource.create(appointment);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    return this.dataSource.update(appointment);
  }


}

