import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuditLog } from './audit-log';
import { RouterTestingHarness } from '@angular/router/testing';

describe('AuditLog Component', () => {
  const mockLogs = [
    { id: 'l1', action: 'CREATE', userId: 'u1', timestamp: '2026-01-01T10:00:00.000Z' },
    { id: 'l2', action: 'DELETE', userId: 'u2', timestamp: '2026-01-02T10:00:00.000Z' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'admin/audit-log',
            component: AuditLog,
            data: { logs: mockLogs },
          },
        ]),
      ],
    });
  });

  it('deve extrair os logs da rota e renderizá-los na tabela', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/admin/audit-log', AuditLog);

    expect(component.logs().length).toBe(2);
    expect(component.logs()[0].id).toBe('l1');

    const html = harness.routeNativeElement!;
    expect(html.innerHTML).toContain('CREATE');
    expect(html.innerHTML).toContain('DELETE');
    expect(html.innerHTML).toContain('l1');
    expect(html.innerHTML).toContain('u1');
  });
});
