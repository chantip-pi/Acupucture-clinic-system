export interface MedicalRecordAcupuncture {
    recordId: number;
    acupunctureId: number;
    lateralSide: string;
}

export class MedicalRecordAcupunctureEntity {
    constructor(
        public readonly recordId: number,
        public readonly acupunctureId: number,
        public readonly lateralSide: string,
    ) {}
    
    static fromData(data: MedicalRecordAcupuncture): MedicalRecordAcupunctureEntity {
        return new MedicalRecordAcupunctureEntity(
            data.recordId,
            data.acupunctureId,
            data.lateralSide,
        );
    }

    toData(): MedicalRecordAcupuncture {
        return {
            recordId: this.recordId,
            acupunctureId: this.acupunctureId,
            lateralSide: this.lateralSide
        };
    }
}