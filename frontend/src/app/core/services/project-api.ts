import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProject, ITask, IUser } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectApi {
  private readonly apiUrl = environment.baseUrl +  '/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${this.apiUrl}/projects`);
  }

  getMembers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/members`);
  }

  getById(projectId: string): Observable<IProject> {
    return this.http.get<IProject>(`${this.apiUrl}/projects/${projectId}`);
  }

  getTasks(projectId: string): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}/projects/${projectId}/tasks`);
  }

  createTask(projectId: string, task: Partial<ITask>): Observable<ITask> {
    return this.http.post<ITask>(`${this.apiUrl}/projects/${projectId}/tasks`, task);
  }
}
