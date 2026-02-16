import { IMedicalRecordIllnessRepository } from "~/domain/repositories/IMedicalRecordIllnessRepository";
import { MedicalRecordIllness } from "~/domain/entities/MedicalRecordIllness";
import { MedicalRecordIllnessDataSource } from "../datasource/MedicalRecordIllnessDataSource";

export class MedicalRecordIllnessRepository implements IMedicalRecordIllnessRepository {
    constructor(private readonly dataSource: MedicalRecordIllnessDataSource) {}
  
    async getAll(): Promise<MedicalRecordIllness[]> {
        return this.dataSource.getAll();
    }
    async getByRecordId(recordId: number): Promise<MedicalRecordIllness[]> {
        return this.dataSource.getByRecordId(recordId);
    }
    async create(recordId: number, medicalRecordIllness: Omit<MedicalRecordIllness, "recordId">): Promise<MedicalRecordIllness> {
        return this.dataSource.create(recordId, medicalRecordIllness);
    }
    async delete(recordId: number, illnessId: number): Promise<void> {
        return this.dataSource.delete(recordId, illnessId);
    }
    async deleteAllIllnessByRecordId(recordId: number): Promise<void> {
        return this.dataSource.deleteAllIllnessByRecordId(recordId);
    }
}