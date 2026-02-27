import { AcupointLocation } from "~/domain/entities/AcupointLocation";
import { ACUPOINT_LOCATION_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class AcupointLocationDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(private readonly baseUrl: string = ACUPOINT_LOCATION_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }


  async getAll(): Promise<AcupointLocation[]> {
    return this.httpClient.get<AcupointLocation[]>("");
  }

  async getById(locationId: number): Promise<AcupointLocation | null> {
    try {
      return await this.httpClient.get<AcupointLocation>(`/${locationId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(acupointLocation: AcupointLocation): Promise<AcupointLocation> {
    return this.httpClient.post<AcupointLocation>("", acupointLocation);
  }

  async update(acupointLocation: AcupointLocation): Promise<AcupointLocation> {
    return this.httpClient.put<AcupointLocation>(`/${acupointLocation.locationId}`, acupointLocation);
  }

  async delete(locationId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${locationId}`);
  }
}
