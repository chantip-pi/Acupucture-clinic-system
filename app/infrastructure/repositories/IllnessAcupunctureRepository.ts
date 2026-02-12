import { IIllnessAcupunctureRepository } from "~/domain/repositories/IIllnessAcupunctureRepository";
import { IllnessAcupuncture } from "~/domain/entities/IllnessAcupuncture";
import { IllnessAcupunctureDataSource } from "~/infrastructure/datasource/IllnessAcupunctureDataSource";

export class IllnessAcupunctureRepository
  implements IIllnessAcupunctureRepository
{
  constructor(private readonly dataSource: IllnessAcupunctureDataSource) {}

  async getAll(): Promise<IllnessAcupuncture[]> {
    return this.dataSource.getAll();
  }

  async getByIllnessId(illnessId: number): Promise<IllnessAcupuncture[]> {
    return this.dataSource.getByIllnessId(illnessId);
  }

  async create(illnessAcupuncture: IllnessAcupuncture): Promise<IllnessAcupuncture> {
    return this.dataSource.create(illnessAcupuncture);
  }

  async delete(illnessId: number, acupunctureId: number): Promise<void> {
    return this.dataSource.delete(illnessId, acupunctureId);
  }

  async deleteAllAcupunctureByIllnessId(illnessId: number): Promise<void> {
    return this.dataSource.deleteAllAcupunctureByIllnessId(illnessId);
  }
}
