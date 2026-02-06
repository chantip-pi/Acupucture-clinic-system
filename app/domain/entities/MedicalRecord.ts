export interface MedicalRecord {
    recordId: number;
    patientId: number;
    doctorId: number;
    appointmentId: number | null; // Changed to allow null
    patientName: string;
    doctorName: string;
    dateTime: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string;
    remarks: string;
    assignees: number[];
    assigneesNames: string[];
  }
  
  export class MedicalRecordEntity {
    constructor(
        public readonly recordId: number,
      public readonly appointmentId: number | null, // Changed to allow null
      public readonly patientId: number,
      public readonly doctorId: number,
      public readonly patientName: string,
      public readonly doctorName: string,
      public readonly dateTime: string,
      public readonly symptoms: string,
      public readonly diagnosis: string,
      public readonly prescriptions: string,
      public readonly remarks: string,
      public readonly assignees: number[],
      public readonly assigneesNames: string[],
    ) {}
  
    static fromData(data: MedicalRecord): MedicalRecordEntity {
      return new MedicalRecordEntity(
        data.recordId,
        data.appointmentId,
        data.patientId,
        data.doctorId,
        data.patientName,
        data.doctorName,
        data.dateTime,
        data.symptoms,
        data.diagnosis,
        data.prescriptions,
        data.remarks,
        data.assignees,
        data.assigneesNames
      );
    }
  
    toData(): MedicalRecord {
      return {
        recordId: this.recordId,
        appointmentId: this.appointmentId,
        patientId: this.patientId,
        doctorId: this.doctorId,
        patientName: this.patientName,
        doctorName: this.doctorName,
        dateTime: this.dateTime,
        symptoms: this.symptoms,
        diagnosis: this.diagnosis,
        prescriptions: this.prescriptions,
        remarks: this.remarks,
        assignees: this.assignees,
        assigneesNames: this.assigneesNames
      };
    }
}