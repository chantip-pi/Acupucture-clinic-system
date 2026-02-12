import { CreateIllnessAcupunctureDTO } from '~/application/dtos/IllnessAcupunctureDTO';
import { IIllnessAcupunctureRepository } from '~/domain/repositories/IIllnessAcupunctureRepository';

export class AddIllnessAcupunctureUseCase {
  constructor(private readonly illnessAcupunctureRepository: IIllnessAcupunctureRepository) {}

    async execute(dto: CreateIllnessAcupunctureDTO): Promise<void> {
        await this.illnessAcupunctureRepository.create(dto);
      }
}