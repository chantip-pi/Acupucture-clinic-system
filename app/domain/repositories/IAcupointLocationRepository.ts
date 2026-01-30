import { AcupointLocation } from "../entities/AcupointLocation";

export interface IAcupointLocationRepository {
  getAll(): Promise<AcupointLocation[]>;
  getById(locationId: number): Promise<AcupointLocation | null>;
  create(
    location: Omit<AcupointLocation, "locationId">
  ): Promise<AcupointLocation>;
  update(location: AcupointLocation): Promise<AcupointLocation>;
  delete(locationId: number): Promise<void>;
}
