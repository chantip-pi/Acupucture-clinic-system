export interface Meridian {
  meridianId: number;
  meridianName: string;
  region: string;
  side: string;
  image: string;
}

export class MeridianEntity {
  constructor(
    public readonly meridianId: number,
    public readonly meridianName: string,
    public readonly region: string,
    public readonly side: string,
    public readonly image: string
  ) {}

  static fromData(data: Meridian): MeridianEntity {
    return new MeridianEntity(
      data.meridianId,
      data.meridianName,
      data.region,
      data.side,
      data.image
    );
  }

  toData(): Meridian {
    return {
      meridianId: this.meridianId,
      meridianName: this.meridianName,
      region: this.region,
      side: this.side,
      image: this.image,
    };
  }
}
