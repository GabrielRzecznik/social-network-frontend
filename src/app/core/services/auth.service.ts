import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/auth/login-request.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/auth/register-request.model';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        // Guardar en localStorage si querés persistencia
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Actualizar el estado
        this.currentUserSubject.next(response);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        this.currentUserSubject.next(response);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  // Restaurar sesión si existe algo en localStorage
  initializeSession(): void {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');

    if (accessToken && refreshToken && user) {
      const parsedUser = JSON.parse(user);
      this.currentUserSubject.next({ accessToken, refreshToken, user: parsedUser });
    }
  }
}