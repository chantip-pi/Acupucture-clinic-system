import { SuggestResult } from "~/domain/entities/Suggestion";
import { GEMINI_ENDPOINT } from "~/constants/api";

export class GeminiDataSource {
  constructor(private readonly baseUrl: string = GEMINI_ENDPOINT) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`
      );
    }
    return (await res.json()) as T;
  }

  async suggest(symptoms: string): Promise<SuggestResult> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    const data = await this.handleResponse<{
      result: SuggestResult;
    }>(res);
    return data.result;
  }
}

// optional default instance
export const geminiDatasource = new GeminiDataSource();
