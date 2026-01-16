export interface CreateAppointmentDTO {
    appointmentId: number;
    patientId: number;
    doctorId: number;
    appointmentDateTime: string;
    patientName: string;
    doctorName: string;
    status: string;
    reason: string;
  }
  
  export interface UpdateAppointmentDTO {
    appointmentId: number;
    patientId: number;
    doctorId: number;
    appointmentDateTime: string;
    patientName: string;
    doctorName: string;
    status: string;
    reason: string;
  }
  
  