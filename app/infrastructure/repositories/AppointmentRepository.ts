import { IAppointmentRepository } from "~/domain/repositories/IAppointmentRepository";
import { Appointment } from "~/domain/entities/Appointment";
import { AppointmentDataSource } from "../datasource/AppointmentDatasource";


export class AppointmentRepository implements IAppointmentRepository {
  constructor(private readonly dataSource: AppointmentDataSource) {}


  async getAll(): Promise<Appointment[]> {
    return this.dataSource.getAll();
  }


  async getListByPatientId(id: number): Promise<Appointment[] | null> {
    return this.dataSource.getListByPatientId(id);
  }


  async create(appointment: Omit<Appointment, "appointmentId">): Promise<Appointment> {
    return this.dataSource.create(appointment);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    return this.dataSource.update(appointment);
  }

  async cancel(appointment: Appointment): Promise<Appointment> {
    return this.dataSource.update(appointment);
  }


}

