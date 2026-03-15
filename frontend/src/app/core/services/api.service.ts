import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          httpParams = httpParams.set(k, String(v));
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${path}`, {
      params: httpParams,
      headers: this.auth.getAuthHeaders(),
    });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.baseUrl}${path}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
