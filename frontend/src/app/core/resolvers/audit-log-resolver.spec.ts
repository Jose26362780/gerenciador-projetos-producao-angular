import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { AdminApi } from '../services/admin-api';
import { auditLogResolver } from './audit-log-resolver';

describe('AuditLog Resolver', () => {
  const adminApiMock = {
    getAuditLog: vi.fn().mockReturnValue(of([{ id: 'l1', action: 'CREATE' }])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AdminApi, useValue: adminApiMock }],
    });
  });

  it('deve buscar o audit log via AdminApi', () => {
    const routeMock = {
      paramMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    const result$ = TestBed.runInInjectionContext(() => {
      return auditLogResolver(routeMock, stateMock) as ReturnType<typeof of>;
    });

    expect(adminApiMock.getAuditLog).toHaveBeenCalled();
    result$.subscribe((logs: unknown) => {
      expect(logs).toEqual([{ id: 'l1', action: 'CREATE' }]);
    });
  });
});
