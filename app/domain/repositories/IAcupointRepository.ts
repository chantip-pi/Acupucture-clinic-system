import { Acupoint } from "../entities/Acupoint";

export interface IAcupointRepository {
  getAll(): Promise<Acupoint[]>;
  getByCode(acupointCode: string): Promise<Acupoint | null>;
  create(acupoint: Omit<Acupoint, "acupointCode">): Promise<Acupoint>;
  update(acupoint: Acupoint): Promise<Acupoint>;
  delete(acupointCode: string): Promise<void>;
}
