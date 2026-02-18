import { Acupoint } from "~/domain/entities/Acupoint";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { ACUPOINT_ENDPOINT } from "~/constants/api";

export class AcupointDataSource {
  constructor(private readonly baseUrl: string = ACUPOINT_ENDPOINT) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Acupoint[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Acupoint[]>(res);
  }

  async getByCode(acupointCode: string): Promise<Acupoint | null> {
    const res = await fetch(`${this.baseUrl}/code/${acupointCode}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Acupoint>(res);
  }

  async create(acupoint: Acupoint): Promise<Acupoint> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acupoint),
    });
    return this.handleResponse<Acupoint>(res);
  }

  async update(acupoint: Acupoint): Promise<Acupoint> {
    const res = await fetch(`${this.baseUrl}/${acupoint.acupointCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acupoint),
    });
    return this.handleResponse<Acupoint>(res);
  }

  async delete(acupointCode: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${acupointCode}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
