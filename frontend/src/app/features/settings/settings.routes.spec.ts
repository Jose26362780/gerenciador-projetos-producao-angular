import { SETTINGS_ROUTES } from './settings.routes';

describe('Settings Routes', () => {
  it('deve definir redirect, profile e billing', () => {
    expect(SETTINGS_ROUTES.length).toBe(3);
    expect(SETTINGS_ROUTES[0].path).toBe('');
    expect(SETTINGS_ROUTES[1].path).toBe('profile');
    expect(SETTINGS_ROUTES[2].path).toBe('billing');
  });

  it('deve carregar os componentes via lazy load', async () => {
    const profile = SETTINGS_ROUTES.find((r) => r.path === 'profile')!;
    const pm = await (profile.loadComponent as unknown as () => Promise<unknown>)();
    expect(pm).toBeTruthy();

    const billing = SETTINGS_ROUTES.find((r) => r.path === 'billing')!;
    const bm = await (billing.loadComponent as unknown as () => Promise<unknown>)();
    expect(bm).toBeTruthy();
  });
});
