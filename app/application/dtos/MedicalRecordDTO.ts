export interface CreateMedicalRecordDTO {
    patientId: number;
    doctorId: number;
    appointmentId: number;
    patientName: string;
    doctorName: string;
    dateTime: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string;
    remarks: string;
  }
  
  export interface UpdateMedicalRecordDTO {
    recordId: number;
    patientId: number;
    doctorId: number;
    appointmentId: number;
    patientName: string;
    doctorName: string;
    dateTime: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string;
    remarks: string;
    assignees: string[];
  }
  
  