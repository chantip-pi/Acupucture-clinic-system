import { Acupuncture } from "~/domain/entities/Acupuncture";
import { ACUPUNCTURE_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class AcupunctureDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = ACUPUNCTURE_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async getAll(): Promise<Acupuncture[]> {
    return this.httpClient.get<Acupuncture[]>("");
  }

  async getById(acupunctureId: number): Promise<Acupuncture | null> {
    try {
      return await this.httpClient.get<Acupuncture>(`/${acupunctureId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getByMeridianId(meridianId: number): Promise<Acupuncture[]> {
    return this.httpClient.get<Acupuncture[]>(`/meridian/${meridianId}`);
  }

  async getByMeridianName(meridianName: string): Promise<Acupuncture[]> {
    return this.httpClient.get<Acupuncture[]>(`/meridianName/${meridianName}`);
  }

  async getByRegionAndSide(region: string, side: string): Promise<Acupuncture[]> {
    return this.httpClient.get<Acupuncture[]>(`/region/${region}/side/${side}`);
  }

  async create(
    acupuncture: Omit<Acupuncture, "acupunctureId">,
  ): Promise<Acupuncture> {
    return this.httpClient.post<Acupuncture>("", acupuncture);
  }

  async update(acupuncture: Acupuncture): Promise<Acupuncture> {
    return this.httpClient.put<Acupuncture>(`/${acupuncture.acupunctureId}`, acupuncture);
  }

  async delete(acupunctureId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${acupunctureId}`);
  }
}
