import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { IUser } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthManager {
  private readonly apiUrl =  environment.baseUrl + '/api/auth';

  private currentUser = signal<IUser | null>(null);
  private token = signal<string | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  login(email: string): Observable<{ token: string; user: IUser }> {
    return this.http.post<{ token: string; user: IUser }>(`${this.apiUrl}/login`, { email }).pipe(
      tap(response => {
        this.token.set(response.token);
        this.currentUser.set(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  fetchCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      this.token.set(token);
      this.currentUser.set(JSON.parse(userJson));
    }
  }
}
