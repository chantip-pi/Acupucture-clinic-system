export interface IllnessAcupuncture {
  illnessId: number;
  acupunctureId: number;
}

export class IllnessAcupunctureEntity {
  constructor(
    public readonly illnessId: number,
    public readonly acupunctureId: number,
  ) {}

  static fromData(data: IllnessAcupuncture): IllnessAcupunctureEntity {
    return new IllnessAcupunctureEntity(data.illnessId, data.acupunctureId);
  }
  toData(): IllnessAcupuncture {
    return {
      illnessId: this.illnessId,
      acupunctureId: this.acupunctureId,
    };
  }
}
