import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Sidebar } from './sidebar';
import { AuthManager } from '../../../core/services/auth-manager';

describe('Sidebar Component', () => {
  function setup(user: { name: string; role: string } | null, isAdmin: boolean) {
    const userSignal = signal(user);
    const authManagerMock = {
      user: userSignal,
      isAdmin: signal(isAdmin),
      logout: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([]), { provide: AuthManager, useValue: authManagerMock }],
    });
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    return { fixture, authManagerMock };
  }

  it('deve criar o componente', () => {
    const { fixture } = setup({ name: 'Felipe Admin', role: 'admin' }, true);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve exibir links de admin quando isAdmin for true', () => {
    const { fixture } = setup({ name: 'Felipe Admin', role: 'admin' }, true);
    const html: HTMLElement = fixture.nativeElement;
    expect(html.innerHTML).toContain('Usuários');
    expect(html.innerHTML).toContain('Audit Log');
    expect(html.innerHTML).toContain('Felipe Admin');
  });

  it('deve ocultar links de admin quando isAdmin for false', () => {
    const { fixture } = setup({ name: 'Ana Souza', role: 'member' }, false);
    const html: HTMLElement = fixture.nativeElement;
    expect(html.innerHTML).not.toContain('Audit Log');
    expect(html.innerHTML).toContain('Ana Souza');
  });

  it('deve chamar logout do AuthManager ao clicar em Sair', () => {
    const { fixture, authManagerMock } = setup({ name: 'Felipe Admin', role: 'admin' }, true);
    const component = fixture.componentInstance;

    component.logout();

    expect(authManagerMock.logout).toHaveBeenCalledTimes(1);

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(authManagerMock.logout).toHaveBeenCalledTimes(2);
  });
});
