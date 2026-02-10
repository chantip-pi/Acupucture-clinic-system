import { Illness } from "../entities/Illness";

export interface IIllnessRepository {
  getAll(): Promise<Illness[]>;
  getById(illnessId: number): Promise<Illness | null>;
  create(illness: Omit<Illness, "illnessId">): Promise<Illness>;
  update(illness: Illness): Promise<Illness>;
  delete(illnessId: number): Promise<void>;
}