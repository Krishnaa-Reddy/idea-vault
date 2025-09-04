import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { DateTime } from 'luxon';
import { SettingsSheet } from './components/shared/settings-sheet';
import { UserProfile } from './components/shared/user-profile';
import { ThemeSwitch } from './core/theme/theme-switch/theme-switch';
import { ThemeService } from './services/theme/theme.service';
import { ShowToaster } from './shared/toaster';

export const DATE_FORMAT = 'EEE, MMM d, y';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgOptimizedImage,
    RouterLink,
    ShowToaster,
    ThemeSwitch,
    SettingsSheet,
    UserProfile,
  ],
  providers: [
    provideHlmDatePickerConfig({
      formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat(DATE_FORMAT),
    }),
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-background text-foreground">
      <header class="bg-card shadow-sm z-10 sticky top-0">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
          <a routerLink="/" class="flex items-center text-2xl font-bold text-primary-foreground">
            <img ngSrc="iv-logo.png" alt="IV Logo" width="40" height="40" />
            <h1 class="text-xl font-semibold text-foreground">IdeaVault</h1>
          </a>
          <div class="flex items-center gap-2">
            <theme-switch />
            <iv-settings-sheet />
            <iv-user-profile />
          </div>
        </div>
      </header>

      <main class="container mx-auto p-4 flex-grow">
        <show-sonner />
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class App {
  protected readonly title = signal('idea-vault');
  private _themeService = inject(ThemeService);

  public toggleTheme(): void {
    this._themeService.toggleDarkMode();
  }
}
