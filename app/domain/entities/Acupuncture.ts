export interface Acupuncture {
  acupunctureId: number;
  acupointCode: string;
  acupointName: string;
  locationId: number;
  pointLeft: number;
  pointTop: number;
  meridianId: number;
  meridianName: string;
  region: string;
  side: string;
  image: string;
}

export class AcupunctureEntity {
  constructor(
    public readonly acupunctureId: number,
    public readonly acupointCode: string,
    public readonly acupointName: string,
    public readonly locationId: number,
    public readonly pointLeft: number,
    public readonly pointTop: number,
    public readonly meridianId: number,
    public readonly meridianName: string,
    public readonly region: string,
    public readonly side: string,
    public readonly image: string,
  ) {}

  static fromData(data: Acupuncture): AcupunctureEntity {
    return new AcupunctureEntity(
      data.acupunctureId,
      data.acupointCode,
      data.acupointName,
      data.locationId,
      data.pointLeft,
      data.pointTop,
      data.meridianId,
      data.meridianName,
      data.region,
      data.side,
      data.image,
    );
  }

  toData(): Acupuncture {
    return {
      acupunctureId: this.acupunctureId,
      acupointCode: this.acupointCode,
      acupointName: this.acupointName,
      locationId: this.locationId,
      pointLeft: this.pointLeft,
      pointTop: this.pointTop,
      meridianId: this.meridianId,
      meridianName: this.meridianName,
      region: this.region,
      side: this.side,
      image: this.image,
    };
  }
}
