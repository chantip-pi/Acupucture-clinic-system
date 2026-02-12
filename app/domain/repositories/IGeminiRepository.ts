import { SuggestResult } from "../entities/Suggestion";

export interface IGeminiRepository {
  getSuggest(symptoms: string): Promise<SuggestResult>;
}

