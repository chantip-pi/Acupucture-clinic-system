export interface Appointment {
    appointmentId: number;
    patientId: number;
    doctorId: number;
    patientName: string;
    doctorName: string;
    appointmentDateTime: string;
    status: string;
    reason: string;
  }
  
  export class AppointmentEntity {
    constructor(
      public readonly appointmentId: number,
      public readonly patientId: number,
      public readonly doctorId: number,
      public readonly patientName: string,
      public readonly doctorName: string,
      public readonly appointmentDateTime: string,
      public readonly status: string,
      public readonly reason: string,
    ) {}
  
    static fromData(data: Appointment): AppointmentEntity {
      return new AppointmentEntity(
        data.appointmentId,
        data.patientId,
        data.doctorId,
        data.patientName,
        data.doctorName,
        data.appointmentDateTime,
        data.status,
        data.reason,
      );
    }
  
    toData(): Appointment {
      return {
        appointmentId: this.appointmentId,
        patientId: this.patientId,
        doctorId: this.doctorId,
        patientName: this.patientName,
        doctorName: this.doctorName,
        appointmentDateTime: this.appointmentDateTime,        
        status: this.status,
        reason: this.reason,
      };
    }
  
  }
  
  