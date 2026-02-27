import { SuggestResult } from "~/domain/entities/Suggestion";
import { GEMINI_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class GeminiDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = GEMINI_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async suggest(symptoms: string): Promise<SuggestResult> {
    const data = await this.httpClient.post<{
      result: SuggestResult;
    }>("", { symptoms });
    return data.result;
  }
}

// optional default instance
export const geminiDatasource = new GeminiDataSource();
