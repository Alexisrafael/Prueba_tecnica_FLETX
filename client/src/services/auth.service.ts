import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  // Llamada al backend para verificar si hay sesión activa
  async isAuthenticated(): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ authenticated: boolean }>('http://localhost:3001/me', { withCredentials: true })
      );
      console.log('AuthService isAuthenticated response:', res);
      return res?.authenticated ?? false;
    } catch {
      return false;
    }
  }
}
