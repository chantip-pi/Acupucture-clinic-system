export interface CreateMeridianDTO {
  meridianName: string;
  region: string;
  side: string;
  image: string;
}

export interface UpdateMeridianDTO {
  meridianId: number;
  meridianName: string;
  region: string;
  side: string;
  image: string;
}