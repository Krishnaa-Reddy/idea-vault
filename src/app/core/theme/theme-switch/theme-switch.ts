import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme/theme.service';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { AsyncPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'theme-switch',
  imports: [HlmLabel, HlmSwitch, AsyncPipe, HlmIcon, NgIcon],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  template: `
    <div class="flex items-center" hlmLabel>
      <ng-icon
        hlm
        size="sm"
        [name]="(theme$ | async) === 'dark' ? 'lucideMoon' : 'lucideSun'"
      ></ng-icon>
      <hlm-switch
        [checked]="(theme$ | async) === 'dark'"
        (changed)="onThemeChange()"
        class="mr-2"
        id="switch-theme"
        aria-label="Switch theme"
      />
    </div>
  `,
})
export class ThemeSwitch {
  private _themeService = inject(ThemeService);
  public theme$ = this._themeService.theme$;

  onThemeChange() {
    this._themeService.toggleDarkMode();
  }
}
