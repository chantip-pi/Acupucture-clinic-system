import { Acupoint } from "~/domain/entities/Acupoint";
import { ACUPOINT_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class AcupointDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = ACUPOINT_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async getAll(): Promise<Acupoint[]> {
    return this.httpClient.get<Acupoint[]>("");
  }

  async getByCode(acupointCode: string): Promise<Acupoint | null> {
    try {
      return await this.httpClient.get<Acupoint>(`/code/${acupointCode}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(acupoint: Acupoint): Promise<Acupoint> {
    return this.httpClient.post<Acupoint>("", acupoint);
  }

  async update(acupoint: Acupoint): Promise<Acupoint> {
    return this.httpClient.put<Acupoint>(`/${acupoint.acupointCode}`, acupoint);
  }

  async delete(acupointCode: string): Promise<void> {
    await this.httpClient.delete<void>(`/${acupointCode}`);
  }
}
