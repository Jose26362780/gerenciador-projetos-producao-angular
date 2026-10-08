import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Members } from './members';
import { ProjectApi } from '../../core/services/project-api';

describe('Members Component', () => {
  const mockMembers = [
    { id: '1', name: 'João Silva', email: 'joao@teste.com', role: 'admin' },
    { id: '2', name: 'Ana Souza', email: 'ana@teste.com', role: 'member' },
  ];

  const projectApiMock = {
    getMembers: vi.fn().mockReturnValue(of(mockMembers)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Members],
      providers: [provideRouter([]), { provide: ProjectApi, useValue: projectApiMock }],
    });
  });

  it('deve criar o componente e buscar os membros via API', async () => {
    const fixture = TestBed.createComponent(Members);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    expect(projectApiMock.getMembers).toHaveBeenCalled();
    expect(component.members().length).toBe(2);
  });

  it('deve renderizar os membros com iniciais, nome, email e role', async () => {
    const fixture = TestBed.createComponent(Members);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const html: HTMLElement = fixture.nativeElement;
    expect(html.innerHTML).toContain('João Silva');
    expect(html.innerHTML).toContain('ana@teste.com');
    expect(html.innerHTML).toContain('admin');
    expect(html.innerHTML).toContain('2 ativos');
  });
});
