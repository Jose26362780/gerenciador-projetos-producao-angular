import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { AdminApi } from '../services/admin-api';
import { usersResolver } from './users-resolver';

describe('Users Resolver', () => {
  const adminApiMock = {
    getUsers: vi.fn().mockReturnValue(of([{ id: '1', name: 'João' }])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AdminApi, useValue: adminApiMock }],
    });
  });

  it('deve buscar os usuários via AdminApi', () => {
    const routeMock = {
      paramMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    const result$ = TestBed.runInInjectionContext(() => {
      return usersResolver(routeMock, stateMock) as ReturnType<typeof of>;
    });

    expect(adminApiMock.getUsers).toHaveBeenCalled();
    result$.subscribe((users: unknown) => {
      expect(users).toEqual([{ id: '1', name: 'João' }]);
    });
  });
});
