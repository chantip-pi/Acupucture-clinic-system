import { Meridian } from "../entities/Meridian";

export interface IMeridianRepository {
  getAll(): Promise<Meridian[]>;
  getById(meridianId: number): Promise<Meridian | null>;
  create(meridian: Omit<Meridian, "meridianId">): Promise<Meridian>;
  update(meridian: Meridian): Promise<Meridian>;
  delete(meridianId: number): Promise<void>;
}