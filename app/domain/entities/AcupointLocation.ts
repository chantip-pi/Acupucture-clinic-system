export interface AcupointLocation {
  locationId: number;
  meridianId: number;
  acupointCode: string;
  pointTop: number;
  pointLeft: number;
}

export class AcupointLocationEntity {
  constructor(
    public readonly locationId: number,
    public readonly meridianId: number,
    public readonly acupointCode: string,
    public readonly pointTop: number,
    public readonly pointLeft: number
  ) {}

  static fromData(data: AcupointLocation): AcupointLocationEntity {
    return new AcupointLocationEntity(
      data.locationId,
      data.meridianId,
      data.acupointCode,
      data.pointTop,
      data.pointLeft
    );
  }
  
  toData(): AcupointLocation {
    return {
      locationId: this.locationId,
      meridianId: this.meridianId,
      acupointCode: this.acupointCode,
      pointTop: this.pointTop,
      pointLeft: this.pointLeft,
    };
  }
}
