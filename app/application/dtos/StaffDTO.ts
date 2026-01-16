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
}

