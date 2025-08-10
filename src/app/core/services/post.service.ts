import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthSessionService } from './auth-session.service';
import { Post } from '../models/post/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
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

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.url}post/create`, post, { headers: this.getAuthHeaders() });
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.url}post/update`, post, { headers: this.getAuthHeaders() });
  }

  updateStatusPost(postId: number, status: number): Observable<Post> {
    return this.http.patch<Post>(`${this.url}post/status`, { postId, status }, { headers: this.getAuthHeaders() });
  }

  getFeedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}post/feed`, { headers: this.getAuthHeaders() });
  }

  getPostsByUser(username: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}post/${username}`, { headers: this.getAuthHeaders() });
  }
}
