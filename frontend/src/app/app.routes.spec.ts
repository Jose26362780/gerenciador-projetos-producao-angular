import { routes } from './app.routes';

describe('App Routes', () => {
  it('deve definir as rotas principais login, layout e wildcard', () => {
    expect(routes.length).toBe(3);
    expect(routes[0].path).toBe('login');
    expect(routes[1].path).toBe('');
    expect(routes[2].path).toBe('**');
  });

  it('deve carregar o componente de Login via lazy load', async () => {
    const route = routes.find((r) => r.path === 'login')!;
    const loader = route.loadComponent as unknown as () => Promise<unknown>;
    const m = await loader();
    expect(m).toBeTruthy();
  });

  it('deve carregar o componente de NotFound via wildcard', async () => {
    const route = routes.find((r) => r.path === '**')!;
    const loader = route.loadComponent as unknown as () => Promise<unknown>;
    const m = await loader();
    expect(m).toBeTruthy();
  });

  it('deve definir os filhos do layout com dashboard, project, members, settings e admin', async () => {
    const layout = routes.find((r) => r.path === '')!;
    const children = layout.children!;
    expect(children.length).toBe(6);

    const dashboard = children.find((c) => c.path === 'dashboard')!;
    const dm = await (dashboard.loadComponent as unknown as () => Promise<unknown>)();
    expect(dm).toBeTruthy();

    const project = children.find((c) => c.path === 'project/:projectId')!;
    const pm = await (project.loadChildren as unknown as () => Promise<unknown>)();
    expect(pm).toBeTruthy();

    const members = children.find((c) => c.path === 'members')!;
    const mm = await (members.loadComponent as unknown as () => Promise<unknown>)();
    expect(mm).toBeTruthy();

    const settings = children.find((c) => c.path === 'settings')!;
    const sm = await (settings.loadChildren as unknown as () => Promise<unknown>)();
    expect(sm).toBeTruthy();

    const admin = children.find((c) => c.path === 'admin')!;
    const am = await (admin.loadChildren as unknown as () => Promise<unknown>)();
    expect(am).toBeTruthy();
  });
});
