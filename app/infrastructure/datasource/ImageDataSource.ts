import { BackendErrorService } from "~/domain/services/ErrorService";
import { IMAGE_BASE_URL } from "~/constants/api";

export class ImageDataSource {
  constructor(private readonly baseUrl: string = IMAGE_BASE_URL) {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      await BackendErrorService.handleErrorResponse(res);
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<string[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    const data = await this.handleResponse<{ images: string[] }>(res);
    return data.images;
  }
  

  async getByFilename(filename: string): Promise<string | null> {
    const res = await fetch(`${this.baseUrl}/${filename}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<string>(res);
  }

  async create(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(this.baseUrl, {
      method: "POST",
      body: formData,
    });
    return this.handleResponse<string>(res);
  }

  async update(filename: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${this.baseUrl}/${filename}`, {
      method: "PUT",
      body: formData,
    });
    return this.handleResponse<string>(res);
  }

  async delete(filename: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${filename}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      await BackendErrorService.handleErrorResponse(res);
    }
  }
}

// optional default instance
export const imageDatasource = new ImageDataSource();
