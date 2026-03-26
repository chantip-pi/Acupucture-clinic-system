import { SuggestResult } from "../entities/Suggestion";

export interface IGeminiRepository {
  getSuggest(symptoms: string, imageData?: File): Promise<SuggestResult>;
}

