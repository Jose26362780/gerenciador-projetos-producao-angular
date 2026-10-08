import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TitleStrategy } from '@angular/router';
import { appConfig } from './app.config';
import { CustomTitleStrategy } from './core/strategies/custom-title-strategy';

describe('App Config', () => {
  it('deve definir os providers da aplicação', () => {
    expect(appConfig.providers.length).toBeGreaterThanOrEqual(5);
  });

  it('deve fornecer o TitleStrategy customizado', () => {
    TestBed.configureTestingModule({
      providers: [...appConfig.providers, provideRouter([]), provideHttpClient()],
    });

    const strategy = TestBed.inject(TitleStrategy);
    expect(strategy).toBeInstanceOf(CustomTitleStrategy);
  });
});
