import { Staff } from "~/domain/entities/Staff";
import { StaffNameDTO } from "~/application/dtos/StaffDTO";
import { BackendErrorService } from "~/domain/services/ErrorService";

export class StaffDataSource {
  constructor(private readonly baseUrl: string = "https://clinic-backend-6f5w.onrender.com/api/staff") {}
  //constructor(private readonly baseUrl: string = "http://localhost:3000/api/staff") {}


  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      await BackendErrorService.handleErrorResponse(res);
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Staff[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Staff[]>(res);
  }

  async getById(staffId: number): Promise<Staff | null> {
    // Backend route: GET /api/staff/id/:staffId
    const res = await fetch(`${this.baseUrl}/id/${staffId}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Staff>(res);
  }

  async getByUsername(username: string): Promise<Staff | null> {
    const res = await fetch(`${this.baseUrl}/username/${username}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Staff>(res);
  }

  async login(username: string, password: string): Promise<Staff | null> {
    // Backend route: GET /api/staff/login/:username/:password
    const res = await fetch(`${this.baseUrl}/login/${username}/${password}`, {
      method: "GET",
    });
    if (res.status === 404) return null;
    return this.handleResponse<Staff>(res);
  }

  async create(staff: Omit<Staff, "staffId">): Promise<Staff> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staff),
    });
    return this.handleResponse<Staff>(res);
  }

  async update(staff: Staff): Promise<Staff> {
    const res = await fetch(`${this.baseUrl}/${staff.staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staff),
    });
    return this.handleResponse<Staff>(res);
  }

  async delete(staffId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${staffId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      await BackendErrorService.handleErrorResponse(res);
    }
  }

  async getDoctors(): Promise<StaffNameDTO[]> {
    const res = await fetch(`${this.baseUrl}/doctors`, {
      method: "GET",
    });
    return this.handleResponse<StaffNameDTO[]>(res);
  }

  async getNurses(): Promise<StaffNameDTO[]> {
    // Backend route: GET /api/staff/nurses
    const res = await fetch(`${this.baseUrl}/nurses`, {
      method: "GET",
    });
    return this.handleResponse<StaffNameDTO[]>(res);
  }
}

// optional default instance
export const staffDatasource = new StaffDataSource();