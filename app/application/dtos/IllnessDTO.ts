export interface CreateIllnessDTO {
  illnessId: number;
  illnessName: string;
  description: string;
  category: string;
}

export interface UpdateIllnessDTO {
  illnessId: number;
  illnessName: string;
  description: string;
  category: string;
}