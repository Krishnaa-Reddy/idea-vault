import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { DateTime } from 'luxon';
import { ShowToaster } from './shared/toaster';
import { ThemeService } from './services/theme/theme.service';
import { ThemeSwitch } from "./core/theme/theme-switch/theme-switch";

export const DATE_FORMAT = 'EEE, MMM d, y';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ShowToaster, ThemeSwitch],
  providers: [
    provideHlmDatePickerConfig({
      formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat(DATE_FORMAT),
    }),
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-background text-foreground">
      <header class="bg-card shadow-sm z-10 sticky top-0">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
          <a
            routerLink="/home"
            class="flex items-center gap-2 text-2xl font-bold text-primary-foreground"
          >
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">IV</span>
            </div>
            <h1 class="text-xl font-semibold text-foreground">IdeaVault</h1>
          </a>
          <!-- <button (click)="toggleTheme()">Toggle theme</button> -->
          <theme-switch></theme-switch>
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
