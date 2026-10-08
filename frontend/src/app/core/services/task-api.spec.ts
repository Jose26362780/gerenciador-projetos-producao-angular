import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskApi } from './task-api';
import { environment } from '../../../environments/environment';

describe('TaskApi', () => {
  let service: TaskApi;
  let httpTestingController: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/api/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskApi, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve criar o service', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar uma task por id via GET', () => {
    const mock = { id: 't1', title: 'Task 1' };

    service.getById('t1').subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/t1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('deve atualizar uma task via PUT', () => {
    const payload = { title: 'Atualizada' };
    const mock = { id: 't1', title: 'Atualizada' };

    service.update('t1', payload).subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/t1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });
});
