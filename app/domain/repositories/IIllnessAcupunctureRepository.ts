import { IllnessAcupuncture } from "../entities/IllnessAcupuncture";

export interface IIllnessAcupunctureRepository {
  getAll(): Promise<IllnessAcupuncture[]>;
  getByIllnessId(illnessId: number): Promise<IllnessAcupuncture[]>;
  create(illnessAcupuncture: IllnessAcupuncture): Promise<IllnessAcupuncture>;
  delete(illnessId: number, acupunctureId: number): Promise<void>;
  deleteAllAcupunctureByIllnessId(illnessId: number): Promise<void>;
}