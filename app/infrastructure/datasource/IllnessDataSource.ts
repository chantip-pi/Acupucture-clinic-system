import { Illness } from "~/domain/entities/Illness";
import { ILLNESS_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class IllnessDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = ILLNESS_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async getAll(): Promise<Illness[]> {
    return this.httpClient.get<Illness[]>("");
  }

  async getById(illnessId: number): Promise<Illness | null> {
    try {
      return await this.httpClient.get<Illness>(`/${illnessId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(illness: Omit<Illness, "illnessId">): Promise<Illness> {
    return this.httpClient.post<Illness>("", illness);
  }

  async update(illness: Illness): Promise<Illness> {
    return this.httpClient.put<Illness>(`/${illness.illnessId}`, illness);
  }

  async delete(illnessId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${illnessId}`);
  }
}
