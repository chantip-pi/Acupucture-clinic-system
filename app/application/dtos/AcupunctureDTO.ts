export interface CreateAcupunctureDTO {
  acupointCode: string;
  meridianId: number;
}

export interface UpdateAcupunctureDTO {
  acupunctureId: number;
  acupointCode: string;
  meridianId: number;
}
