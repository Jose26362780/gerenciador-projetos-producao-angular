import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { of, throwError } from 'rxjs';
import { AuthManager } from '../../../core/services/auth-manager';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  const authManagerMock = {
    login: vi.fn().mockReturnValue(of({ token: '123', user: { nome: 'Teste' } })),
    logout: vi.fn(),
    isAuthenticated: vi.fn().mockReturnValue(false),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthManager, useValue: authManagerMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar um componente com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve navegar para o /dashboard quando o login for um sucesso', () => {
    const email = 'felipe@exemplo.com';

    component.email = email;

    component.login();

    expect(authManagerMock.login).toHaveBeenCalledWith(email);
    expect(authManagerMock.login).toHaveBeenCalledTimes(1);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve exibir a mensagem de erro e parar o loading quando o login falhar', () => {
    authManagerMock.login.mockReturnValueOnce(throwError(() => new Error('Não autorizado')));

    const email = 'felipe@exemplo.com';

    component.email = email;

    component.login();

    expect(authManagerMock.login).toHaveBeenCalledWith(email);
    expect(authManagerMock.login).toHaveBeenCalledTimes(1);

    expect(routerMock.navigate).not.toHaveBeenCalled();

    expect(component.error).toBe('Email inválido. Tente felipe@example.com ou ana@example.com');
    expect(component.isLoading).toBe(false);
  });

  it('deve atualizar o e-mail via ngModel quando o usuário digitar no input', async () => {
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="email-input"]',
    );

    const email = 'aluno@teste.com';

    inputEl.value = email;

    inputEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.email).toBe(email);
  });

  it('deve acionar o login ao submeter o formulário (ngSubmit)', async () => {
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="email-input"]',
    );
    const email = 'aluno@teste.com';
    inputEl.value = email;
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const formDebug = fixture.debugElement.query(By.css('[data-testid="login-form"]'));

    formDebug.triggerEventHandler('submit', null);

    expect(authManagerMock.login).toHaveBeenCalledWith(email);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve renderizar a mensagem de erro no HTML quando a variável error estiver preenchida', () => {
    const errorMessage = 'Credenciais inválidas. Tente novamente.';

    component.error = errorMessage;

    fixture.detectChanges();

    const errorEl: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="error-message"]',
    );

    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain(errorMessage);
  });

  it('deve desabilitar o botão e alterar o texto enquanto estiver carregando (isLoading)', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const buttonEl: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="submit-button"]',
    );

    expect(buttonEl.disabled).toBe(true);
    expect(buttonEl.textContent).toContain('Autenticando');
  });

  it('deve preencher o e-mail ao clicar nos cards de acesso rápido', () => {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button[type="button"]'),
    );
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    buttons[0].click();
    fixture.detectChanges();
    expect(component.email).toBe('felipe@example.com');

    buttons[1].click();
    fixture.detectChanges();
    expect(component.email).toBe('ana@example.com');
  });

  it('deve exibir a seta quando não estiver carregando e desabilitar o botão sem e-mail', () => {
    component.isLoading = false;
    component.email = '';
    fixture.detectChanges();

    const html: HTMLElement = fixture.nativeElement;
    expect(html.innerHTML).toContain('→');

    const buttonEl: HTMLButtonElement = html.querySelector(
      '[data-testid="submit-button"]',
    ) as HTMLButtonElement;
    expect(buttonEl.disabled).toBe(true);
    expect(buttonEl.textContent).toContain('Acessar Plataforma');
  });
});
