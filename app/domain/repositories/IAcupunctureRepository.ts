import { Acupuncture } from "../entities/Acupuncture";

export interface IAcupunctureRepository {
  getAll(): Promise<Acupuncture[]>;
  getById(acupunctureId: number): Promise<Acupuncture | null>;
  getByMeridianId(meridianId: number): Promise<Acupuncture[]>;
  getByMeridianName(meridianName: string): Promise<Acupuncture[]>;
  getByRegionAndSide(region: string, side: string): Promise<Acupuncture[]>;
  create(acupuncture: Omit<Acupuncture, "acupunctureId">): Promise<Acupuncture>;
  update(acupuncture: Acupuncture): Promise<Acupuncture>;
  delete(acupunctureId: number): Promise<void>;
}