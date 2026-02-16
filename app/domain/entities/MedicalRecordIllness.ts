export interface MedicalRecordIllness {
    recordId: number;
    illnessId: number;
}

export class MedicalRecordIllnessEntity {
    constructor(
        public readonly recordId: number,
        public readonly illnessId: number,
    ) {}
    
    static fromData(data: MedicalRecordIllness): MedicalRecordIllnessEntity {
        return new MedicalRecordIllnessEntity(
            data.recordId,
            data.illnessId,
        );
    }

    toData(): MedicalRecordIllness {
        return {
            recordId: this.recordId,
            illnessId: this.illnessId,
        };
    }
}