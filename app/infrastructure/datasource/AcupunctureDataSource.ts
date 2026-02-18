import { Acupuncture } from "~/domain/entities/Acupuncture";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { ACUPUNCTURE_ENDPOINT } from "~/constants/api";

export class AcupunctureDataSource {
  constructor(private readonly baseUrl: string = ACUPUNCTURE_ENDPOINT) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Acupuncture[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Acupuncture[]>(res);
  }

  async getById(acupunctureId: number): Promise<Acupuncture | null> {
    const res = await fetch(`${this.baseUrl}/${acupunctureId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Acupuncture>(res);
  }

  async getByMeridianId(meridianId: number): Promise<Acupuncture[]> {
    const res = await fetch(`${this.baseUrl}/meridian/${meridianId}`, {
      method: "GET",
    });
    return this.handleResponse<Acupuncture[]>(res);
  }

  async getByMeridianName(meridianName: string): Promise<Acupuncture[]> {
    const res = await fetch(`${this.baseUrl}/meridianName/${meridianName}`, {
      method: "GET",
    });
    return this.handleResponse<Acupuncture[]>(res);
  }

  async getByRegionAndSide(region: string, side: string): Promise<Acupuncture[]> {
    const res = await fetch(`${this.baseUrl}/region/${region}/side/${side}`, {
      method: "GET",
    });
    return this.handleResponse<Acupuncture[]>(res);
  }

  async create(
    acupuncture: Omit<Acupuncture, "acupunctureId">,
  ): Promise<Acupuncture> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acupuncture),
    });
    return this.handleResponse<Acupuncture>(res);
  }

  async update(acupuncture: Acupuncture): Promise<Acupuncture> {
    const res = await fetch(`${this.baseUrl}/${acupuncture.acupunctureId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acupuncture),
    });
    return this.handleResponse<Acupuncture>(res);
  }

  async delete(acupunctureId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${acupunctureId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
