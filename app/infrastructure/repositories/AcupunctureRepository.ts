import { IAcupunctureRepository } from "~/domain/repositories/IAcupunctureRepository";
import { Acupuncture } from "~/domain/entities/Acupuncture";
import { AcupunctureDataSource } from "~/infrastructure/datasource/AcupunctureDataSource";

export class AcupunctureRepository implements IAcupunctureRepository {
  constructor(private readonly dataSource: AcupunctureDataSource) {}
  
  async getAll(): Promise<Acupuncture[]> {
    return this.dataSource.getAll();
  }

  async getById(id: number): Promise<Acupuncture | null> {
    return this.dataSource.getById(id);
  }

  async getByMeridianId(meridianId: number): Promise<Acupuncture[]> {
    return this.dataSource.getByMeridianId(meridianId);
  }

  async getByMeridianName(meridianName: string): Promise<Acupuncture[]> {
    return this.dataSource.getByMeridianName(meridianName);
  }

  async getByRegionAndSide(region: string, side: string): Promise<Acupuncture[]> {
    return this.dataSource.getByRegionAndSide(region, side);
  }

  async create(
    acupuncture: Omit<Acupuncture, "acupunctureId">,
  ): Promise<Acupuncture> {
    return this.dataSource.create(acupuncture);
  }

  async update(acupuncture: Acupuncture): Promise<Acupuncture> {
    return this.dataSource.update(acupuncture);
  }

  async delete(acupunctureId: number): Promise<void> {
    return this.dataSource.delete(acupunctureId);
  }
}
