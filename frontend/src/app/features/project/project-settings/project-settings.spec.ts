import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectSettings } from './project-settings';
import { RouterTestingHarness } from '@angular/router/testing';

describe('ProjectSettings Component', () => {
  const mockProject = { id: 'p-1', name: 'Projeto X', description: 'Desc X' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'project/settings',
            component: ProjectSettings,
            data: { project: mockProject },
          },
        ]),
      ],
    });
  });

  it('deve extrair o projeto da rota e renderizar nome, descrição e id', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/project/settings', ProjectSettings);

    expect(component.project.name).toBe('Projeto X');

    const html = harness.routeNativeElement!;
    expect(html.innerHTML).toContain('Projeto X');
    expect(html.innerHTML).toContain('Desc X');
    expect(html.innerHTML).toContain('p-1');
  });
});
