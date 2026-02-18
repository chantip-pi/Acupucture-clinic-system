import { Illness } from "~/domain/entities/Illness";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { ILLNESS_ENDPOINT } from "~/constants/api";

export class IllnessDataSource {
  constructor(private readonly baseUrl: string = ILLNESS_ENDPOINT) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Illness[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Illness[]>(res);
  }

  async getById(illnessId: number): Promise<Illness | null> {
    const res = await fetch(`${this.baseUrl}/${illnessId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Illness>(res);
  }

  async create(illness: Omit<Illness, "illnessId">): Promise<Illness> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(illness),
    });
    return this.handleResponse<Illness>(res);
  }

  async update(illness: Illness): Promise<Illness> {
    const res = await fetch(`${this.baseUrl}/${illness.illnessId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(illness),
    });
    return this.handleResponse<Illness>(res);
  }

  async delete(illnessId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${illnessId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
