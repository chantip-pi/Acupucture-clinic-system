import {
  SuggestResult,
} from "~/domain/entities/Suggestion";
import { IGeminiRepository } from "~/domain/repositories/IGeminiRepository";

export class GetSuggestUseCase {
  constructor(private readonly geminiRepository: IGeminiRepository) { }

  async execute(symptoms: string): Promise<SuggestResult> {
    return await this.geminiRepository.getSuggest(symptoms);
  }
}