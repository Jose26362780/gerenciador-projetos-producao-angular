import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Profile } from './profile';
import { AuthManager } from '../../../core/services/auth-manager';

describe('Profile Component', () => {
  const mockUser = signal({ id: '1', name: 'Felipe', email: 'felipe@example.com', role: 'admin' });
  const authManagerMock = {
    user: mockUser,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideRouter([]), { provide: AuthManager, useValue: authManagerMock }],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve exibir os dados do usuário logado', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    const html: HTMLElement = fixture.nativeElement;
    expect(html.innerHTML).toContain('Felipe');
    expect(html.innerHTML).toContain('felipe@example.com');
    expect(html.innerHTML).toContain('admin');
  });
});
