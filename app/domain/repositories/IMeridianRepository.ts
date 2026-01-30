import { Meridian } from "../entities/Meridian";

export interface IMeridianRepository {
  getAll(): Promise<Meridian[]>;
  getById(meridianId: number): Promise<Meridian | null>;
  getAvailableRegions(): Promise<string[]>;
  getSidesByRegion(region: string[]): Promise<Record<string, string[]>>
  create(meridian: Omit<Meridian, "meridianId">): Promise<Meridian>;
  update(meridian: Meridian): Promise<Meridian>;
  delete(meridianId: number): Promise<void>;
}