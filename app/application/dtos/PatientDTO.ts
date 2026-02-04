export interface CreatePatientDTO {
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  remainingCourse: number;
  congenitalDisease: string;
  surgeryHistory: string;
}

export interface UpdatePatientDTO {
  patientId: number;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  remainingCourse: number;
  congenitalDisease: string;
  surgeryHistory: string;
}

