import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { TaskApi } from '../services/task-api';
import { taskResolver } from './task-resolver';

describe('Task Resolver', () => {
  const taskApiMock = {
    getById: vi.fn().mockReturnValue(of({ id: 't1', title: 'Task 1' })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TaskApi, useValue: taskApiMock }],
    });
  });

  it('deve extrair o taskId da URL e buscar a task na API', () => {
    const routeMock = {
      paramMap: convertToParamMap({ taskId: 't1' }),
    } as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    const result$ = TestBed.runInInjectionContext(() => {
      return taskResolver(routeMock, stateMock) as ReturnType<typeof of>;
    });

    expect(taskApiMock.getById).toHaveBeenCalledWith('t1');
    result$.subscribe((task: unknown) => {
      expect(task).toEqual({ id: 't1', title: 'Task 1' });
    });
  });
});
