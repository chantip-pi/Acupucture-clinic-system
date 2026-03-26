import { useAuth } from '~/context/AuthContext';

export class HttpClient {
  private baseURL: string;
  private getAuthToken: () => string | null;

  constructor(baseURL: string, getAuthToken: () => string | null) {
    this.baseURL = baseURL;
    this.getAuthToken = getAuthToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get current token
    const token = this.getAuthToken();
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add authorization header if token exists
    if (token) {
      headers['x-access-token'] = token;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      // Handle 401 unauthorized - token might be expired
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get current token
    const token = this.getAuthToken();
    
    // Prepare headers (don't set Content-Type for FormData - browser will set it with boundary)
    const headers: Record<string, string> = {};

    // Add authorization header if token exists
    if (token) {
      headers['x-access-token'] = token;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      // Handle 401 unauthorized - token might be expired
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Factory function to create HTTP client with auth
export function createAuthenticatedHttpClient(baseURL: string): HttpClient {
  const getAuthToken = () => {
    // Get token from sessionStorage (userSession) or localStorage (auth_token)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userSession = window.sessionStorage.getItem('userSession');
      if (userSession) {
        try {
          const parsed = JSON.parse(userSession);
          return parsed.token || null;
        } catch {
          return null;
        }
      }
    }
    
    // Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = window.localStorage.getItem('auth_token');
      return token;
    }
    
    return null;
  };

  return new HttpClient(baseURL, getAuthToken);
}
