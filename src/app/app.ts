import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
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
    NgIcon,
    HlmButton,
  ],
  providers: [
    provideIcons({ lucideGithub }),
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
            <a hlmBtn variant="link" routerLink="/about" class="cursor-pointer">Docs</a>
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

      <footer class="border-t border-gray-200 dark:border-gray-800 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center space-x-2 mb-4 md:mb-0">
              <img ngSrc="iv-logo.png" alt="IV Logo" width="30" height="30" />
              <span class="text-gray-600 dark:text-gray-300"
                >© 2025 IdeaVault. Never forget again.</span
              >
            </div>
            <div class="flex space-x-6 items-center justify-center">
              <button hlmBtn variant="link" routerLink="/about" class="cursor-pointer text-accent-foreground">
                About
              </button>
              <a
                [href]="REPO_URL"
                target="_blank"
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <ng-icon name="lucideGithub" size="24"></ng-icon>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class App {
  REPO_URL = 'https://github.com/Krishnaa-Reddy/idea-vault';
  protected readonly title = signal('idea-vault');
  private _themeService = inject(ThemeService);

  public toggleTheme(): void {
    this._themeService.toggleDarkMode();
  }
}
