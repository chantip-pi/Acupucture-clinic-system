import { IllnessAcupuncture } from "~/domain/entities/IllnessAcupuncture";
import { ILLNESS_ACUPUNCTURE_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class IllnessAcupunctureDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = ILLNESS_ACUPUNCTURE_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async getAll(): Promise<IllnessAcupuncture[]> {
    return this.httpClient.get<IllnessAcupuncture[]>("");
  }

  async getByIllnessId(illnessId: number): Promise<IllnessAcupuncture[]> {
    return this.httpClient.get<IllnessAcupuncture[]>(`/${illnessId}`);
  }

  async create(illnessAcupuncture: IllnessAcupuncture): Promise<IllnessAcupuncture> {
    return this.httpClient.post<IllnessAcupuncture>("", illnessAcupuncture);
  }

  async delete(illnessId: number, acupunctureId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${illnessId}/${acupunctureId}`);
  }

  async deleteAllAcupunctureByIllnessId(illnessId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${illnessId}`);
  }
}
