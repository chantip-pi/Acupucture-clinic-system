export interface MedicalRecordAcupuncture {
    recordId: number;
    acupunctureId: number;
}

export class MedicalRecordAcupunctureEntity {
    constructor(
        public readonly recordId: number,
        public readonly acupunctureId: number,
    ) {}
    
    static fromData(data: MedicalRecordAcupuncture): MedicalRecordAcupunctureEntity {
        return new MedicalRecordAcupunctureEntity(
            data.recordId,
            data.acupunctureId,
        );
    }

    toData(): MedicalRecordAcupuncture {
        return {
            recordId: this.recordId,
            acupunctureId: this.acupunctureId,
        };
    }
}