import { IIllnessRepository } from "~/domain/repositories/IIllnessRepository";
import { Illness } from "~/domain/entities/Illness";
import { IllnessDataSource } from "~/infrastructure/datasource/IllnessDataSource";

export class IllnessRepository implements IIllnessRepository {
  constructor(private readonly dataSource: IllnessDataSource) {}

  async getAll(): Promise<Illness[]> {
    return this.dataSource.getAll();
  }

  async getById(id: number): Promise<Illness | null> {
    return this.dataSource.getById(id);
  }

  async create(illness: Omit<Illness, "illnessId">): Promise<Illness> {
    return this.dataSource.create(illness);
  }

  async update(illness: Illness): Promise<Illness> {
    return this.dataSource.update(illness);
  }

  async delete(illnessId: number): Promise<void> {
    return this.dataSource.delete(illnessId);
  }
}
