import { PROJECT_ROUTES } from './project.routes';

describe('Project Routes', () => {
  it('deve definir a rota raiz com resolver de projeto e filhos', () => {
    expect(PROJECT_ROUTES.length).toBe(1);
    const root = PROJECT_ROUTES[0];
    expect(root.path).toBe('');
    expect(root.resolve).toBeTruthy();
    expect(root.children!.length).toBe(5);
  });

  it('deve carregar os componentes de board, backlog, settings e task-detail via lazy load', async () => {
    const root = PROJECT_ROUTES[0];
    const board = root.children!.find((c) => c.path === 'board')!;
    const bm = await (board.loadComponent as unknown as () => Promise<unknown>)();
    expect(bm).toBeTruthy();

    const backlog = root.children!.find((c) => c.path === 'backlog')!;
    const blm = await (backlog.loadComponent as unknown as () => Promise<unknown>)();
    expect(blm).toBeTruthy();

    const settings = root.children!.find((c) => c.path === 'settings')!;
    const sm = await (settings.loadComponent as unknown as () => Promise<unknown>)();
    expect(sm).toBeTruthy();

    const detail = root.children!.find((c) => c.path === 'task/:taskId')!;
    const tm = await (detail.loadComponent as unknown as () => Promise<unknown>)();
    expect(tm).toBeTruthy();
  });

  it('deve definir títulos, resolvers e guards', () => {
    const root = PROJECT_ROUTES[0];
    const board = root.children!.find((c) => c.path === 'board')!;
    expect(board.title).toBe('Board');
    expect(board.resolve).toBeTruthy();

    const backlog = root.children!.find((c) => c.path === 'backlog')!;
    expect(backlog.title).toBe('Backlog');

    const detail = root.children!.find((c) => c.path === 'task/:taskId')!;
    expect(detail.title).toBe('Detalhes da Task');
    expect(detail.canDeactivate).toBeTruthy();
    expect(detail.outlet).toBe('detail');
  });
});
