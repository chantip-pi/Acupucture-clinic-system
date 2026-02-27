export interface LoginDTO {
  username: string;
  password: string;
}

export interface CreateStaffDTO {
  username: string;
  password: string;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  email: string;
  title: string;
  token?: string;
}

export interface UpdateStaffDTO {
  staffId: number;
  username: string;
  password: string;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  email: string;
  title: string;
  token?: string;
}

// DTO for staff name projection (used for doctor/Staff lists)
export interface StaffNameDTO {
  staffId: number;
  nameSurname: string;
}

