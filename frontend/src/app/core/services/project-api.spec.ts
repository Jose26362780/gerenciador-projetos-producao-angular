import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectApi } from './project-api';
import { environment } from '../../../environments/environment';

describe('ProjectApi', () => {
  let service: ProjectApi;
  let httpTestingController: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/api`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectApi, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve criar o service', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todos os projetos via GET', () => {
    const mock = [{ id: 'p1', name: 'Projeto 1' }];

    service.getAll().subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/projects`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('deve buscar os membros via GET', () => {
    const mock = [{ id: 'u1', name: 'Ana' }];

    service.getMembers().subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/members`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('deve buscar um projeto por id via GET', () => {
    const mock = { id: 'p1', name: 'Projeto 1' };

    service.getById('p1').subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/projects/p1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('deve buscar as tasks de um projeto via GET', () => {
    const mock = [{ id: 't1', title: 'Task 1' }];

    service.getTasks('p1').subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/projects/p1/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('deve criar uma task via POST', () => {
    const payload = { title: 'Nova Task' };
    const mock = { id: 't1', title: 'Nova Task' };

    service.createTask('p1', payload).subscribe((res) => {
      expect(res).toEqual(mock);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/projects/p1/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });
});
