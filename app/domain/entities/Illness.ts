export interface Illness {
  illnessId: number;
  illnessName: string;
  description: string;
  category: string;
}

export class IllnessEntity {
  constructor(
    public readonly illnessId: number,
    public readonly illnessName: string,
    public readonly description: string,
    public readonly category: string,
  ) {}

  static fromData(data: Illness): IllnessEntity {
    return new IllnessEntity(
      data.illnessId,
      data.illnessName,
      data.description,
      data.category,
    );
  }

  toData(): Illness {
    return {
      illnessId: this.illnessId,
      illnessName: this.illnessName,
      description: this.description,
      category: this.category,
    };
  }
}
