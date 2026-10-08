import { TestBed } from '@angular/core/testing';
import { IProject, ITask } from '../../../core/models';
import { provideRouter, Router } from '@angular/router';
import { Board } from './board';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProjectApi } from '../../../core/services/project-api';

describe('Board Component', () => {
  const mockProject: IProject = {
    id: 'p-1',
    name: 'App iOS',
    description: '...',
  };
  const mockTasks: ITask[] = [
    { id: 't-1', title: 'Fazer o Design', status: 'todo', projectId: 'p-1', description: '...' },
    {
      id: 't-2',
      title: 'Codar a Tela',
      status: 'in_progress',
      projectId: 'p-1',
      description: '...',
    },
    {
      id: 't-3',
      title: 'Publicar App',
      status: 'done',
      projectId: 'p-1',
      description: '...',
    },
  ];

  const projectApiMock = {
    getTasks: vi.fn().mockReturnValue(of(mockTasks)),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    projectApiMock.getTasks.mockReturnValue(of(mockTasks));
    TestBed.configureTestingModule({
      providers: [
        { provide: ProjectApi, useValue: projectApiMock },
        provideRouter([
          {
            path: 'project/board',
            component: Board,
            data: {
              project: mockProject,
              tasks: mockTasks,
            },
          },
        ]),
      ],
    });
  });

  it('deve filtrar as tarefas corretamente usando computed signals e renderizar nas colunas', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/board', Board);
    const html = harness.routeNativeElement!;

    expect(component.todoTasks().length).toBe(1);
    expect(component.inProgressTasks().length).toBe(1);
    expect(component.doneTasks().length).toBe(1);

    const todoColumn = html.querySelector('[data-testid="todo-column"]');
    const inProgressColumn = html.querySelector('[data-testid="in-progress-column"]');

    const cardsNoTodo = todoColumn?.querySelectorAll('[data-testid="task-card"]');
    const cardsNoInProgress = inProgressColumn?.querySelectorAll('[data-testid="task-card"]');

    expect(cardsNoTodo?.length).toBe(1);
    expect(cardsNoInProgress?.length).toBe(1);

    expect(todoColumn?.innerHTML).toContain('Fazer o Design');
    expect(inProgressColumn?.innerHTML).toContain('Codar a Tela');
    expect(html.innerHTML).toContain('Publicar App');
  });

  it('deve abrir o modal de detalhes (Task Detail) ao clicar em um card', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/project/board', Board);
    const html = harness.routeNativeElement!;

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const firstTaskCard = html.querySelector('[data-testid="task-card"]') as HTMLDivElement;

    firstTaskCard.click();

    expect(navigateSpy).toHaveBeenCalledWith(
      [{ outlets: { detail: ['task', 't-1'] } }],
      expect.anything(),
    );
  });

  it('deve abrir o detalhe ao clicar nos cards de Em Progresso e Concluído', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/project/board', Board);
    const html = harness.routeNativeElement!;

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const inProgressColumn = html.querySelector('[data-testid="in-progress-column"]')!;
    const inProgressCard = inProgressColumn.querySelector(
      '[data-testid="task-card"]',
    ) as HTMLDivElement;
    inProgressCard.click();

    expect(navigateSpy).toHaveBeenCalledWith(
      [{ outlets: { detail: ['task', 't-2'] } }],
      expect.anything(),
    );

    const allDivs = Array.from(html.querySelectorAll('div.group')) as HTMLDivElement[];
    const doneCard = allDivs.find((d) => d.innerHTML.includes('Publicar App'))!;
    expect(doneCard).toBeTruthy();
    doneCard.click();

    expect(navigateSpy).toHaveBeenCalledWith(
      [{ outlets: { detail: ['task', 't-3'] } }],
      expect.anything(),
    );
  });

  it('deve recarregar as tasks via API ao chamar loadTasks', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/board', Board);

    const novasTasks: ITask[] = [
      { id: 't-9', title: 'Nova', status: 'todo', projectId: 'p-1', description: 'x' },
    ];
    projectApiMock.getTasks.mockReturnValueOnce(of(novasTasks));

    component.loadTasks();

    expect(projectApiMock.getTasks).toHaveBeenCalledWith('p-1');
    expect(component.tasks()).toEqual(novasTasks);
    expect(component.todoTasks().length).toBe(1);
  });

  it('deve navegar para o outlet de detalhe ao chamar openTask diretamente', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/board', Board);

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.openTask('t-2');

    expect(navigateSpy).toHaveBeenCalledWith(
      [{ outlets: { detail: ['task', 't-2'] } }],
      expect.anything(),
    );
  });
});
