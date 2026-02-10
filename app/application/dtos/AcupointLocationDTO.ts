export interface CreateAcupointLocationDTO {
  locationId: number;
  meridianId: number;
  acupointCode: string;
  pointTop: number;
  pointLeft: number;
}

export interface UpdateAcupointLocationDTO {
  locationId: number;
  meridianId: number;
  acupointCode: string;
  pointTop: number;
  pointLeft: number;
}