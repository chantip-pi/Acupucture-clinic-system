import { IAcupointLocationRepository } from "~/domain/repositories/IAcupointLocationRepository";
import { AcupointLocation } from "~/domain/entities/AcupointLocation";
import { AcupointLocationDataSource } from "../datasource/AcupointLocationDataSource";

export class AcupointLocationRepository implements IAcupointLocationRepository {
  constructor(private readonly dataSource: AcupointLocationDataSource) {}
  
  async getAll(): Promise<AcupointLocation[]> {
    return this.dataSource.getAll();
  }

  async getById(id: number): Promise<AcupointLocation | null> {
    return this.dataSource.getById(id);
  }

  async create(
    acupointLocation: Omit<AcupointLocation, "id">,
  ): Promise<AcupointLocation> {
    return this.dataSource.create(acupointLocation);
  }

  async update(acupointLocation: AcupointLocation): Promise<AcupointLocation> {
    return this.dataSource.update(acupointLocation);
  }

  async delete(locationId: number): Promise<void> {
    return this.dataSource.delete(locationId);
  }
}
