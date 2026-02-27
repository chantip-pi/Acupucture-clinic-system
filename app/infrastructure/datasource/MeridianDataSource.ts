import { Meridian } from "~/domain/entities/Meridian";
import { MERIDIAN_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class MeridianDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = MERIDIAN_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async getAll(): Promise<Meridian[]> {
    return this.httpClient.get<Meridian[]>("");
  }

  async getAllNames(): Promise<string[]> {
    return this.httpClient.get<string[]>("/names");
  }

  async getById(meridianId: number): Promise<Meridian | null> {
    try {
      return await this.httpClient.get<Meridian>(`/meridian/${meridianId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getByRegionAndSide(region: string, side: string): Promise<Meridian[]> {
    return this.httpClient.get<Meridian[]>(`/region/${region}/side/${side}`);
  }

  async getAvailableRegions(): Promise<string[]> {
    return this.httpClient.get<string[]>("/regions");
  }

  async getSidesByRegion(region: string[]): Promise<Record<string, string[]>> {
    return this.httpClient.get<Record<string, string[]>>(`/regions/${region}`);
  }

  async create(meridian: Omit<Meridian, "meridianId">): Promise<Meridian> {
    return this.httpClient.post<Meridian>("", meridian);
  }

  async update(meridian: Meridian): Promise<Meridian> {
    return this.httpClient.put<Meridian>(`/${meridian.meridianId}`, meridian);
  }

  async delete(meridianId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${meridianId}`);
  }
}
