import { AcupointLocation } from "~/domain/entities/AcupointLocation";

export class AcupointLocationDataSource {
  // constructor(private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/acupointLocations") {}

  constructor(
    private readonly baseUrl: string = "http://localhost:3000/api/acupointLocations",
  ) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<AcupointLocation[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<AcupointLocation[]>(res);
  }

  async getById(locationId: number): Promise<AcupointLocation | null> {
    const res = await fetch(`${this.baseUrl}/${locationId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<AcupointLocation>(res);
  }

  async create(acupointLocation: AcupointLocation): Promise<AcupointLocation> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acupointLocation),
    });
    return this.handleResponse<AcupointLocation>(res);
  }

  async update(acupointLocation: AcupointLocation): Promise<AcupointLocation> {
    const res = await fetch(`${this.baseUrl}/${acupointLocation.locationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acupointLocation),
    });
    return this.handleResponse<AcupointLocation>(res);
  }

  async delete(locationId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${locationId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
