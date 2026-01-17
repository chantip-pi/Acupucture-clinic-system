export interface Acupoint {
  acupointCode: string;
  acupointName: string;
}

export class AcupointEntity {
  constructor(
    public readonly acupointCode: string,
    public readonly acupointName: string
  ) {}

  static fromData(data: Acupoint): AcupointEntity {
    return new AcupointEntity(data.acupointCode, data.acupointName);
  }

  toData(): Acupoint {
    return {
      acupointCode: this.acupointCode,
      acupointName: this.acupointName,
    };
  }
}
