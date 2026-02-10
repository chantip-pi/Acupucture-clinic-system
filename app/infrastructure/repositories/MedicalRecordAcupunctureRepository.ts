import { IMedicalRecordAcupunctureRepository } from "~/domain/repositories/IMedicalRecordAcupunctureRepository";
import { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";
import { MedicalRecordAcupunctureDataSource } from "../datasource/MedicalRecordAcupunctureDataSource";

export class MedicalRecordAcupunctureRepository implements IMedicalRecordAcupunctureRepository {
    constructor(private readonly dataSource: MedicalRecordAcupunctureDataSource) {}
  
    async getAll(): Promise<MedicalRecordAcupuncture[]> {
        return this.dataSource.getAll();
    }
    async getByRecordId(recordId: number): Promise<MedicalRecordAcupuncture[]> {
        return this.dataSource.getByRecordId(recordId);
    }
    async create(recordId: number, medicalRecordAcupuncture: Omit<MedicalRecordAcupuncture, "recordId">): Promise<MedicalRecordAcupuncture> {
        return this.dataSource.create(recordId, medicalRecordAcupuncture);
    }
    async delete(recordId: number, acupunctureId: number): Promise<void> {
        return this.dataSource.delete(recordId, acupunctureId);
    }
    async deleteAllAcupunctureByRecordId(recordId: number): Promise<void> {
        return this.dataSource.deleteAllAcupunctureByRecordId(recordId);
    }
}