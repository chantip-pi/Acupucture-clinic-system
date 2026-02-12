import { SuggestResult } from "~/domain/entities/Suggestion";

export class GeminiDataSource {
  constructor(private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/suggest") {}
  //constructor(private readonly baseUrl: string = "http://localhost:3000/api/suggest") {}

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
