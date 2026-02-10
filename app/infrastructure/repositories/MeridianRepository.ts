import { IMeridianRepository } from "~/domain/repositories/IMeridianRepository";
import { Meridian } from "~/domain/entities/Meridian";
import { MeridianDataSource } from "~/infrastructure/datasource/MeridianDataSource";

export class MeridianRepository implements IMeridianRepository {
  constructor(private readonly dataSource: MeridianDataSource) {}

  async getAll(): Promise<Meridian[]> {
    return this.dataSource.getAll();
  }
  
  async getById(id: number): Promise<Meridian | null> {
    return this.dataSource.getById(id);
  }

  async getByRegionAndSide(region: string, side: string): Promise<Meridian[]> {
      return this.dataSource.getByRegionAndSide(region, side);
  }

  async getAvailableRegions(): Promise<string[]> {
      return this.dataSource.getAvailableRegions();
  }

  async getSidesByRegion(region: string[]): Promise<Record<string, string[]>> {
      return this.dataSource.getSidesByRegion(region);
  }

  async create(meridian: Meridian): Promise<Meridian> {
    return this.dataSource.create(meridian);
  }

  async update(meridian: Meridian): Promise<Meridian> {
    return this.dataSource.update(meridian);
  }

  async delete(id: number): Promise<void> {
    return this.dataSource.delete(id);
  }
}
