import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { ProjectApi } from '../services/project-api';
import { projectTasksResolver } from './project-tasks-resolver';

describe('ProjectTasks Resolver', () => {
  const projectApiMock = {
    getTasks: vi.fn().mockReturnValue(of([{ id: 't1', title: 'Task 1' }])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ProjectApi, useValue: projectApiMock }],
    });
  });

  it('deve extrair o projectId da URL e buscar as tasks na API', () => {
    const routeMock = {
      paramMap: convertToParamMap({ projectId: 'p1' }),
    } as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    const result$ = TestBed.runInInjectionContext(() => {
      return projectTasksResolver(routeMock, stateMock) as ReturnType<typeof of>;
    });

    expect(projectApiMock.getTasks).toHaveBeenCalledWith('p1');
    result$.subscribe((tasks: unknown) => {
      expect(tasks).toEqual([{ id: 't1', title: 'Task 1' }]);
    });
  });
});
