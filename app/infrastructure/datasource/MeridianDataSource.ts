import { Meridian } from "~/domain/entities/Meridian";

export class MeridianDataSource {
  constructor(private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/meridians") {}
  // constructor(private readonly baseUrl: string = "http://localhost:3000/api/meridians") {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Meridian[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Meridian[]>(res);
  }

  async getById(meridianId: number): Promise<Meridian | null> {
    const res = await fetch(`${this.baseUrl}/meridian/${meridianId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Meridian>(res);
  }

  async getByRegionAndSide(region: string, side: string): Promise<Meridian[]> {
    const res = await fetch(`${this.baseUrl}/region/{${region}}/side/{${side}}`, {
      method: "GET",
    });
    return this.handleResponse<Meridian[]>(res);
  }

  async getAvailableRegions(): Promise<string[]> {
    const res = await fetch(`${this.baseUrl}/regions`, {
      method: "GET",
    });
    return this.handleResponse<string[]>(res);
  }

  async getSidesByRegion(region: string[]):Promise<Record<string, string[]>> {
    const res = await fetch(`${this.baseUrl}/regions/{${region}}`, {
      method: "GET",
    });
    return this.handleResponse<Promise<Record<string, string[]>>>(res);
  }

  async create(meridian: Omit<Meridian, "meridianId">): Promise<Meridian> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meridian),
    });
    return this.handleResponse<Meridian>(res);
  }

  async update(meridian: Meridian): Promise<Meridian> {
    const res = await fetch(`${this.baseUrl}/${meridian.meridianId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meridian),
    });
    return this.handleResponse<Meridian>(res);
  }

  async delete(meridianId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${meridianId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
