export interface Staff {
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

export class StaffEntity {
  constructor(
    public readonly staffId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly nameSurname: string,
    public readonly phoneNumber: string,
    public readonly birthday: string,
    public readonly gender: string,
    public readonly email: string,
    public readonly title: string,
    public readonly token?: string
  ) {}

  static fromData(data: Staff): StaffEntity {
    return new StaffEntity(
      data.staffId,
      data.username,
      data.password,
      data.nameSurname,
      data.phoneNumber,
      data.birthday,
      data.gender,
      data.email,
      data.title,
      data.token
    );
  }

  toData(): Staff {
    return {
      staffId: this.staffId,
      username: this.username,
      password: this.password,
      nameSurname: this.nameSurname,
      phoneNumber: this.phoneNumber,
      birthday: this.birthday,
      gender: this.gender,
      email: this.email,
      title: this.title,
      token: this.token,
    };
  }
}

