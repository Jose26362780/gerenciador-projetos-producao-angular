import { of, throwError } from 'rxjs';
import { ITask } from '../../../core/models';
import { TestBed } from '@angular/core/testing';
import { TaskApi } from '../../../core/services/task-api';
import { provideRouter, Router } from '@angular/router';
import { TaskDetail } from './task-detail';
import { RouterTestingHarness } from '@angular/router/testing';

describe('Task Details Component', () => {
  const mockTaskOriginal: ITask = {
    id: 't-123',
    title: 'Arrumar CSS',
    description: 'A tela tá feia',
    status: 'todo',
    projectId: 'p-1',
    assigneeId: 'u-1',
  };

  const mockTaskEdited = { ...mockTaskOriginal, title: 'Título Modificado' };

  let taskApiMock = {
    update: vi.fn().mockReturnValue(of(mockTaskEdited)),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    taskApiMock.update.mockReturnValue(of(mockTaskEdited));
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskApi, useValue: taskApiMock },
        provideRouter([
          {
            path: 'project/task',
            component: TaskDetail,
            data: {
              task: mockTaskOriginal,
            },
          },
          {
            path: 'project/empty',
            component: TaskDetail,
            data: {},
          },
        ]),
      ],
    });
  });

  it('deve extrair a task da URL, permitir a digitação e Salvar a tarefa chamando a API', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/task', TaskDetail);

    await harness.fixture.whenStable();

    const html = harness.routeNativeElement!;

    const titleInput = html.querySelector('[data-testid="task-title-input"]') as HTMLInputElement;
    expect(titleInput.value).toBe('Arrumar CSS');

    titleInput.value = 'Título Modificado';
    titleInput.dispatchEvent(new Event('input'));

    harness.detectChanges();

    expect(component.isDirty()).toBe(true);

    const saveBtn = html.querySelector('[data-testid="save-task-btn"]') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(false);

    saveBtn.click();

    expect(taskApiMock.update).toHaveBeenCalledWith(
      't-123',
      expect.objectContaining({
        title: 'Título Modificado',
      }),
    );
  });

  it('deve fechar o modal corretamente navegando o Router', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/project/task', TaskDetail);
    await harness.fixture.whenStable();
    const html = harness.routeNativeElement!;

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const closeBtn = html.querySelector('[data-testid="close-modal-btn"]') as HTMLButtonElement;
    closeBtn.click();

    expect(navigateSpy).toHaveBeenCalledWith([{ outlets: { detail: null } }], expect.anything());
  });

  it('deve chamar ngOnInit, markDirty e hasUnsavedChanges', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/task', TaskDetail);
    await harness.fixture.whenStable();

    expect(component.hasUnsavedChanges()).toBe(false);

    component.ngOnInit();
    component.markDirty();

    expect(component.isDirty()).toBe(true);
    expect(component.hasUnsavedChanges()).toBe(true);
  });

  it('deve marcar dirty ao editar descrição e status e exibir Gravando durante save', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/task', TaskDetail);
    await harness.fixture.whenStable();
    const html = harness.routeNativeElement!;

    const textarea = html.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'Nova descrição';
    textarea.dispatchEvent(new Event('input'));
    harness.detectChanges();

    const select = html.querySelector('select') as HTMLSelectElement;
    select.value = 'done';
    select.dispatchEvent(new Event('change'));
    harness.detectChanges();

    expect(component.isDirty()).toBe(true);
    expect(html.innerHTML).toContain('Alterações pendentes');

    component.isSaving.set(true);
    harness.detectChanges();
    expect(html.innerHTML).toContain('Gravando...');

    component.isSaving.set(false);
    harness.detectChanges();
    expect(html.innerHTML).toContain('Salvar Tarefa');
  });

  it('deve fechar ao clicar no backdrop e no botão ✕ fechar', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/project/task', TaskDetail);
    await harness.fixture.whenStable();
    const html = harness.routeNativeElement!;

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const backdrop = html.querySelector('.fixed.inset-0') as HTMLElement;
    backdrop.click();
    expect(navigateSpy).toHaveBeenCalledWith([{ outlets: { detail: null } }], expect.anything());

    const headerCloseBtn = html.querySelectorAll('button')[0] as HTMLButtonElement;
    headerCloseBtn.click();
    expect(navigateSpy).toHaveBeenCalledTimes(2);
  });

  it('deve tratar erro da API no save resetando isSaving', async () => {
    taskApiMock.update.mockReturnValueOnce(throwError(() => new Error('fail')));
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/task', TaskDetail);
    await harness.fixture.whenStable();

    component.markDirty();
    component.save();

    expect(component.isSaving()).toBe(false);
    expect(component.isDirty()).toBe(true);
  });

  it('deve atualizar task e limpar dirty no save com sucesso', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/task', TaskDetail);
    await harness.fixture.whenStable();

    component.markDirty();
    component.save();

    expect(taskApiMock.update).toHaveBeenCalled();
    expect(component.task()).toEqual(mockTaskEdited);
    expect(component.isDirty()).toBe(false);
    expect(component.isSaving()).toBe(false);
  });

  it('deve abortar o save quando editedTask for nulo e renderizar nada sem task na rota', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/empty', TaskDetail);
    await harness.fixture.whenStable();

    expect(component.task()).toBeNull();
    expect(component.editedTask()).toBeNull();

    component.save();
    expect(taskApiMock.update).not.toHaveBeenCalled();

    const html = harness.routeNativeElement!;
    expect(html.innerHTML).not.toContain('task-title-input');
    expect(html.innerHTML).toContain('container');
  });
});
