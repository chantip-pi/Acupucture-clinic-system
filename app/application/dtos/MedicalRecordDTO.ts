export interface CreateMedicalRecordDTO {
    patientId: number;
    doctorId: number;
    appointmentId: number | null;
    dateTime: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string;
    remarks: string;
    assignees: number[];
  }
  
  export interface UpdateMedicalRecordDTO {
    recordId: number;
    patientId: number;
    doctorId: number;
    appointmentId: number;
    dateTime: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string;
    remarks: string;
    assignees: number[];
  }
  
  