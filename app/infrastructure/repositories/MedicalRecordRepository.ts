import { IMedicalRecordRepository } from "~/domain/repositories/IMedicalRecordRepository";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { MedicalRecordDataSource } from "../datasource/MedicalRecordDatasource";
import { StaffNameDTO } from "~/application/dtos/StaffDTO";


export class MedicalRecordRepository implements IMedicalRecordRepository {
    constructor(private readonly dataSource: MedicalRecordDataSource) { }



    async getAll(): Promise<MedicalRecord[]> {
        return this.dataSource.getAll();
    }


    async getListByPatientId(id: number): Promise<MedicalRecord[] | null> {
        return this.dataSource.getListByPatientId(id);
    }

    async getById(id: number): Promise<MedicalRecord | null> {
        return this.dataSource.getById(id);
    }


    async create(medicalRecord: Omit<MedicalRecord, "medicalRecordId">): Promise<MedicalRecord> {
        return this.dataSource.create(medicalRecord);
    }

    async update(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
        return this.dataSource.update(medicalRecord);
    }


    async getAssignedStaff(id: number): Promise<StaffNameDTO[] | null> {
        return this.dataSource.getAssignedStaff(id);
    }



}

