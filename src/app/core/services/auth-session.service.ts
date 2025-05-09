import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse } from '../models/auth/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  saveSession(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response);
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  initializeSession(): void {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const user = localStorage.getItem('user');
  
      if (accessToken && refreshToken && user) {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next({ accessToken, refreshToken, user: parsedUser });
      }
    }
  }
}
