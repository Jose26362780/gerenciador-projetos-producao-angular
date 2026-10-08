import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthManager } from './auth-manager';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('Auth Manager Service', () => {
  let service: AuthManager;
  let httpTestingController: HttpTestingController;
  let routerMock = {
    navigate: vi.fn(),
  };

  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage',
      {
        value: mockLocalStorage,
        writable: true
      });

    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthManager,
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthManager);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve fazer o login, salvar os dados e disparar o tap() com sucesso', () => {
    const setItemSpy = vi.spyOn(globalThis.localStorage, 'setItem');

    service.login('admin@teste.com').subscribe((response) => {
      expect(response.token).toBe('meu_token_secreto');
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/api/auth/login`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@teste.com' });

    req.flush({
      token: 'meu_token_secreto',
      user: { id: 1, nome: 'Admin', role: 'admin' },
    });

    expect(setItemSpy).toHaveBeenCalledTimes(2);
    expect(setItemSpy).toHaveBeenCalledWith('token', 'meu_token_secreto');
    expect(setItemSpy).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ id: 1, nome: 'Admin', role: 'admin' }),
    );

    expect(service.getToken()).toBe('meu_token_secreto');
    expect(service.user()).toEqual({ id: 1, nome: 'Admin', role: 'admin' });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(true);
  });

  it('deve abortar as lógicas do tap() se a API retornar erro HTTP 401', () => {
    const setItemSpy = vi.spyOn(globalThis.localStorage, 'setItem');

    service.login('invalido@teste.com').subscribe({
      error: (httpError: HttpErrorResponse) => {
        expect(httpError.status).toBe(401);
        expect(httpError.error.message).toBe('Credenciais inválidas');
      },
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/api/auth/login`);

    req.flush({ message: 'Credenciais inválidas' }, { status: 401, statusText: 'Unauthorized' });

    expect(setItemSpy).not.toHaveBeenCalled();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
  });

  it('deve fazer logout limpando os dados e navegando para /login', () => {
    const removeSpy = vi.spyOn(globalThis.localStorage, 'removeItem');

    service.login('admin@teste.com').subscribe();
    const req = httpTestingController.expectOne(`${environment.baseUrl}/api/auth/login`);
    req.flush({
      token: 'tok123',
      user: { id: '1', name: 'Admin', email: 'a@a.com', role: 'admin' },
    });
    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isAdmin()).toBe(false);
    expect(removeSpy).toHaveBeenCalledWith('token');
    expect(removeSpy).toHaveBeenCalledWith('user');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve buscar o usuário atual via GET /me e atualizar o signal', () => {
    const mockUser = { id: '1', name: 'Felipe', email: 'f@f.com', role: 'member' };

    service.fetchCurrentUser().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/api/auth/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    expect(service.user()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(false);
  });

  it('deve carregar token e usuário do localStorage ao inicializar', () => {
    const storedUser = { id: '9', name: 'Guardado', email: 'g@g.com', role: 'member' };
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'token-guardado';
      if (key === 'user') return JSON.stringify(storedUser);
      return null;
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthManager,
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const freshService = TestBed.inject(AuthManager);
    const freshHttp = TestBed.inject(HttpTestingController);

    expect(freshService.getToken()).toBe('token-guardado');
    expect(freshService.user()).toEqual(storedUser);
    expect(freshService.isAuthenticated()).toBe(true);
    expect(freshService.isAdmin()).toBe(false);

    freshHttp.verify();

    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.getItem.mockReturnValue(null);
  });
});
