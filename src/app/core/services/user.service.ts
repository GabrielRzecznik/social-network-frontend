import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthSessionService } from './auth-session.service';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient,
    private authSessionService: AuthSessionService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authSessionService.getCurrentUser()?.accessToken || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.url}user/profile`, user, { headers: this.getAuthHeaders() });
  }
}
