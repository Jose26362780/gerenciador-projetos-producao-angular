import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  private readonly apiUrl = environment.baseUrl + '/api/tasks';

  constructor(private http: HttpClient) {}

  getById(taskId: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.apiUrl}/${taskId}`);
  }

  update(taskId: string, task: Partial<ITask>): Observable<ITask> {
    return this.http.put<ITask>(`${this.apiUrl}/${taskId}`, task);
  }
}
