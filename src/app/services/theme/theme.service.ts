import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export type Theme = 'light' | 'dark';

/**
 * This service is responsible for managing the theme of the application.
 * Below two helped us here.
 * URL: https://www.youtube.com/watch?v=b-9rk7ji-KA
 * URL: https://dev.to/this-is-angular/dark-mode-with-analog-tailwind-4049
 */
@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private readonly _document = inject(DOCUMENT);

  private _theme = signal<Theme>((localStorage.getItem('theme') || 'light') as Theme);
  public readonly theme$ = toObservable(this._theme);

  themeChangeEffect = effect(() => {
    const theme = this._theme();
    if (theme === 'dark') {
      this._document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this._document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  public toggleDarkMode(): void {
    const currentTheme = this._document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this._theme.set(newTheme);
  }

  ngOnDestroy(): void {
    this.themeChangeEffect.destroy();
  }
}
