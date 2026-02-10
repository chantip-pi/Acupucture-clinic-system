import { IAcupointRepository } from "~/domain/repositories/IAcupointRepository";
import { Acupoint } from "~/domain/entities/Acupoint";
import { AcupointDataSource } from "../datasource/AcupointDataSource";

export class AcupointRepository implements IAcupointRepository {
  constructor(private readonly dataSource: AcupointDataSource) {}
  
  async getAll(): Promise<Acupoint[]> {
    return this.dataSource.getAll();
  }

  async getByCode(acupointCode: string): Promise<Acupoint | null> {
    return this.dataSource.getByCode(acupointCode);
  }

  async create(acupoint: Acupoint): Promise<Acupoint> {
    return this.dataSource.create(acupoint);
  }

  async update(acupoint: Acupoint): Promise<Acupoint> {
    return this.dataSource.update(acupoint);
  }

  async delete(acupointCode: string): Promise<void> {
    return this.dataSource.delete(acupointCode);
  }
}
