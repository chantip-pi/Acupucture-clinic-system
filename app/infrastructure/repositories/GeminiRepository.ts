import { SuggestResult } from "~/domain/entities/Suggestion";
import {
  IGeminiRepository,
} from "~/domain/repositories/IGeminiRepository";
import { GeminiDataSource } from "~/infrastructure/datasource/GeminiDataSource"


export class GeminiRepository implements IGeminiRepository {
  constructor(private readonly dataSource: GeminiDataSource) {}

  async getSuggest(symptoms: string, imageData?: File): Promise<SuggestResult> {
    return this.dataSource.suggest(symptoms, imageData);
  }
}
