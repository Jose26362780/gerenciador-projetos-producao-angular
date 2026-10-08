import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, IAuditLog } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminApi {
  private readonly apiUrl = environment.baseUrl + '/api/admin';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/users`);
  }

  getAuditLog(): Observable<IAuditLog[]> {
    return this.http.get<IAuditLog[]>(`${this.apiUrl}/audit-log`);
  }
}
