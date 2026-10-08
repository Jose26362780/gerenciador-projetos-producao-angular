import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Backlog } from './backlog';
import { RouterTestingHarness } from '@angular/router/testing';

describe('Backlog Component', () => {
  const mockProject = { id: 'p-1', name: 'Projeto X', description: 'Desc X' };
  const mockTasks = [
    { id: 't-1', title: 'Task 1', description: 'Desc 1', status: 'todo', projectId: 'p-1' },
    { id: 't-2', title: 'Task 2', description: 'Desc 2', status: 'in_progress', projectId: 'p-1' },
    { id: 't-3', title: 'Task 3', description: 'Desc 3', status: 'done', projectId: 'p-1' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'project/backlog',
            component: Backlog,
            data: { project: mockProject, tasks: mockTasks },
          },
        ]),
      ],
    });
  });

  it('deve extrair projeto e tasks da rota e renderizar a tabela', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/backlog', Backlog);

    expect(component.project.name).toBe('Projeto X');
    expect(component.tasks().length).toBe(3);

    const html = harness.routeNativeElement!;
    expect(html.innerHTML).toContain('Projeto X');
    expect(html.innerHTML).toContain('Task 1');
    expect(html.innerHTML).toContain('Task 2');
    expect(html.innerHTML).toContain('Task 3');
  });

  it('deve mapear os labels de status corretamente incluindo fallback', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/backlog', Backlog);

    expect(component.getStatusLabel('todo')).toBe('A Fazer');
    expect(component.getStatusLabel('in_progress')).toBe('Em Progresso');
    expect(component.getStatusLabel('done')).toBe('Concluído');
    expect(component.getStatusLabel('unknown_status')).toBe('unknown_status');
  });
});
