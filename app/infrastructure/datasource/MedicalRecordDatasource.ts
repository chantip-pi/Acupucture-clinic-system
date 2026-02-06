import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";
import { BackendErrorService } from "~/domain/services/ErrorService";

export class MedicalRecordDataSource {
    constructor(private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/medicalRecords") { }
    //constructor(private readonly baseUrl: string = "http://localhost:3000/api/medicalRecords") {}


    private async handleResponse<T>(res: Response): Promise<T> {
        if (!res.ok) {
            await BackendErrorService.handleErrorResponse(res);
        }
        return (await res.json()) as T;
    }

    async getAll(): Promise<MedicalRecord[]> {
        const res = await fetch(this.baseUrl, { method: "GET" });
        return this.handleResponse<MedicalRecord[]>(res);
    }


    async getById(medicalRecordId: number): Promise<MedicalRecord | null> {
        const res = await fetch(`${this.baseUrl}/${medicalRecordId}`, {
            method: "GET",
        });
        if (res.status === 404) return null;
        return this.handleResponse<MedicalRecord>(res);
    }


    async getListByPatientId(patientId: number): Promise<MedicalRecord[] | null> {
        const res = await fetch(`${this.baseUrl}/patient/${patientId}`, {
            method: "GET",
        });
        if (res.status === 404) return null;
        return this.handleResponse<MedicalRecord[]>(res);
    }


    async create(medicalRecord: Omit<MedicalRecord, "medicalRecordId">): Promise<MedicalRecord> {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medicalRecord),
        });
        return this.handleResponse<MedicalRecord>(res);
    }

    async update(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
        const res = await fetch(`${this.baseUrl}/${medicalRecord.recordId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medicalRecord),
        });
        return this.handleResponse<MedicalRecord>(res);
    }



}

// optional default instance
export const medicalRecordDatasource = new MedicalRecordDataSource();