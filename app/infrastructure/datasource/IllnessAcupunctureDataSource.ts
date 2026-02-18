import { IllnessAcupuncture } from "~/domain/entities/IllnessAcupuncture";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { ILLNESS_ACUPUNCTURE_ENDPOINT } from "~/constants/api";

export class IllnessAcupunctureDataSource {
  constructor(private readonly baseUrl: string = ILLNESS_ACUPUNCTURE_ENDPOINT) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<IllnessAcupuncture[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<IllnessAcupuncture[]>(res);
  }

  async getByIllnessId(illnessId: number): Promise<IllnessAcupuncture[]> {
    const res = await fetch(`${this.baseUrl}/${illnessId}`, {
      method: "GET",
    });
    return this.handleResponse<IllnessAcupuncture[]>(res);
  }

  async create(illnessAcupuncture: IllnessAcupuncture): Promise<IllnessAcupuncture> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(illnessAcupuncture),
    });
    return this.handleResponse<IllnessAcupuncture>(res);
  }

  async delete(illnessId: number, acupunctureId: number): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/${illnessId}/${acupunctureId}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }

  async deleteAllAcupunctureByIllnessId(illnessId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${illnessId}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}
