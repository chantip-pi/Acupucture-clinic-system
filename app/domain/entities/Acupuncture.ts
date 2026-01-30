export interface Acupuncture {
    acupunctureId: number;
    acupointCode: string;
    meridianId: number;
}

export class AcupunctureEntity {
    constructor(
        public readonly acupunctureId: number,
        public readonly acupointCode: string,
        public readonly meridianId: number,
    ) {}

    static fromData(data: Acupuncture): AcupunctureEntity {
        return new AcupunctureEntity(
            data.acupunctureId,
            data.acupointCode,
            data.meridianId,
        );
    }
    
    toData(): Acupuncture {
        return {
            acupunctureId: this.acupunctureId,
            acupointCode: this.acupointCode,
            meridianId: this.meridianId,
        };
    }
}