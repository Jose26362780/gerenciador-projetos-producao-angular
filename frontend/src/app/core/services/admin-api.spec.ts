import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminApi } from './admin-api';
import { environment } from '../../../environments/environment';

describe('AdminApi', () => {
  let service: AdminApi;
  let httpTestingController: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/api/admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminApi, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve criar o service', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar os usuários via GET', () => {
    const mockUsers = [{ id: '1', name: 'João', email: 'joao@teste.com', role: 'admin' }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('deve buscar o audit log via GET', () => {
    const mockLogs = [{ id: 'l1', action: 'CREATE', userId: '1', timestamp: '2026-01-01' }];

    service.getAuditLog().subscribe((logs) => {
      expect(logs).toEqual(mockLogs);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/audit-log`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLogs);
  });
});
