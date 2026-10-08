import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayout } from './main-layout';
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { AuthManager } from '../../../core/services/auth-manager';

describe('Main Layout Component', () => {
  let fixture: ComponentFixture<MainLayout>;
  const authManagerMock = {
    user: signal({ id: '1', name: 'Felipe Admin', email: 'f@f.com', role: 'admin' }),
    isAdmin: signal(true),
    logout: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([]), { provide: AuthManager, useValue: authManagerMock }],
    });

    fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
  });

  it('deve criar o layout', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar o layout com a sidebar real e os espaços de roteamento', () => {
    const sidebar = fixture.debugElement.query(By.css('app-sidebar'));
    expect(sidebar).toBeTruthy();

    const outlets = fixture.debugElement.queryAll(By.directive(RouterOutlet));
    expect(outlets.length).toBe(2);

    const html: HTMLElement = fixture.nativeElement;
    expect(html.innerHTML).toContain('app-sidebar');
  });
});
