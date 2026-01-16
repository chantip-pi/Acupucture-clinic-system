export interface CreateAppointmentDTO {
    patientId: number;
    doctorId: number;
    appointmentDateTime: string;
    patientName: string;
    doctorName: string;
    status: string;
    reason: string;
  }
  
  export interface UpdateAppointmentDTO {
    patientId: number;
    doctorId: number;
    appointmentDateTime: string;
    patientName: string;
    doctorName: string;
    status: string;
    reason: string;
  }
  
  