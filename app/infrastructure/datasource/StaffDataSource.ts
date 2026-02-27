import { Staff } from "~/domain/entities/Staff";
import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";
import { STAFF_ENDPOINT } from "~/constants/api";
import { createAuthenticatedHttpClient } from "../http/HttpClient";

export class StaffDataSource {
  private httpClient: ReturnType<typeof createAuthenticatedHttpClient>;

  constructor(baseUrl: string = STAFF_ENDPOINT) {
    this.httpClient = createAuthenticatedHttpClient(baseUrl);
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      await BackendErrorService.handleErrorResponse(res);
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Staff[]> {
    return this.httpClient.get<Staff[]>("");
  }

  async getById(staffId: number): Promise<Staff | null> {
    try {
      return await this.httpClient.get<Staff>(`/id/${staffId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getByUsername(username: string): Promise<Staff | null> {
    try {
      return await this.httpClient.get<Staff>(`/username/${username}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async login(username: string, password: string): Promise<Staff | null> {
    const res = await fetch(`${STAFF_ENDPOINT}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    
    if (res.status === 404 || res.status === 403) {
      return null;
    }
    
    const staff = await this.handleResponse<Staff>(res);
    return staff;
  }

  async create(staff: Omit<Staff, "staffId">): Promise<Staff> {
    return this.httpClient.post<Staff>("", staff);
  }

  async update(staff: Staff): Promise<Staff> {
    return this.httpClient.put<Staff>(`/${staff.staffId}`, staff);
  }

  async delete(staffId: number): Promise<void> {
    await this.httpClient.delete<void>(`/${staffId}`);
  }

  async getDoctors(): Promise<StaffNameDTO[]> {
    return this.httpClient.get<StaffNameDTO[]>("/doctors");
  }

  async getStaffs(): Promise<StaffNameDTO[]> {
    return this.httpClient.get<StaffNameDTO[]>("/staffs");
  }
}

// optional default instance
export const staffDatasource = new StaffDataSource();