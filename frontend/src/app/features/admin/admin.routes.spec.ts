import { ADMIN_ROUTES } from './admin.routes';

describe('Admin Routes', () => {
  it('deve definir redirect, users e audit-log', () => {
    expect(ADMIN_ROUTES.length).toBe(3);
    expect(ADMIN_ROUTES[0].path).toBe('');
    expect(ADMIN_ROUTES[1].path).toBe('users');
    expect(ADMIN_ROUTES[2].path).toBe('audit-log');
  });

  it('deve carregar os componentes via lazy load', async () => {
    const users = ADMIN_ROUTES.find((r) => r.path === 'users')!;
    const um = await (users.loadComponent as unknown as () => Promise<unknown>)();
    expect(um).toBeTruthy();

    const audit = ADMIN_ROUTES.find((r) => r.path === 'audit-log')!;
    const alm = await (audit.loadComponent as unknown as () => Promise<unknown>)();
    expect(alm).toBeTruthy();
  });

  it('deve definir resolvers e títulos', () => {
    const users = ADMIN_ROUTES.find((r) => r.path === 'users')!;
    expect(users.title).toBe('Usuários');
    expect(users.resolve).toBeTruthy();

    const audit = ADMIN_ROUTES.find((r) => r.path === 'audit-log')!;
    expect(audit.title).toBe('Audit Log');
    expect(audit.resolve).toBeTruthy();
  });
});
