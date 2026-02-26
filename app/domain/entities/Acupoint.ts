export interface Acupoint {
  acupointCode: string;
  acupointName: string;
  isBilateral: boolean;
}

export class AcupointEntity {
  constructor(
    public readonly acupointCode: string,
    public readonly acupointName: string,
    public readonly isBilateral: boolean,
  ) {}

  static fromData(data: Acupoint): AcupointEntity {
    return new AcupointEntity(data.acupointCode, data.acupointName, data.isBilateral);
  }

  toData(): Acupoint {
    return {
      acupointCode: this.acupointCode,
      acupointName: this.acupointName,
      isBilateral: this.isBilateral
    };
  }
}
