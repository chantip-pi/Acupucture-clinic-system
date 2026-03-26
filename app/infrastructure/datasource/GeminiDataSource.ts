import { SuggestResult } from "~/domain/entities/Suggestion";
import { GEMINI_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class GeminiDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = GEMINI_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async suggest(symptoms: string, imageData?: File): Promise<SuggestResult> {
    if (imageData) {
      // Use FormData for multipart/form-data when image is provided
      const formData = new FormData();
      if (symptoms) {
        formData.append('symptoms', symptoms);
      }
      formData.append('image', imageData);
      
      // Use the new postFormData method
      const data = await this.httpClient.postFormData<{
        result: SuggestResult;
      }>("", formData);
      return data.result;
    } else {
      // Use regular JSON when no image is provided
      const data = await this.httpClient.post<{
        result: SuggestResult;
      }>("", { symptoms });
      return data.result;
    }
  }
}

// optional default instance
export const geminiDatasource = new GeminiDataSource();
