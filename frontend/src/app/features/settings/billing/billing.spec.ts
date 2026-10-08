import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Billing } from './billing';

describe('Billing Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Billing],
      providers: [provideRouter([])],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(Billing);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar as informações do plano Pro', () => {
    const fixture = TestBed.createComponent(Billing);
    fixture.detectChanges();

    const html: HTMLElement = fixture.nativeElement;
    expect(html.innerHTML).toContain('Plano Atual');
    expect(html.innerHTML).toContain('Pro');
    expect(html.innerHTML).toContain('R$ 49,90');
  });
});
