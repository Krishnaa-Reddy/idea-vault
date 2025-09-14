import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLock,
  lucideLogIn,
  lucideLogOut,
  lucideSettings,
  lucideUser,
} from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenu, HlmMenuBarItem } from '@spartan-ng/helm/menu';
import { UserService } from '../../services/users';
import { IvTooltipComponent } from './iv-tooltip';

@Component({
  selector: 'iv-user-profile',
  standalone: true,
  providers: [provideIcons({ lucideUser, lucideLock, lucideSettings, lucideLogOut, lucideLogIn })],
  imports: [
    BrnMenuTrigger,
    NgOptimizedImage,
    HlmMenu,
    HlmMenuBarItem,
    NgIcon,
    HlmIcon,
    HlmButton,
    IvTooltipComponent,
  ],
  template: `
    <iv-tooltip value="User Profile" [lazy]="true">
      <button
        hlmMenuBarItem
        [brnMenuTriggerFor]="profile"
        hlmBtn
        size="icon"
        variant="secondary"
        class="size-8 cursor-pointer"
      >
        @if (user_metadata()) {
          <img
            class="rounded-full"
            [ngSrc]="user_metadata()?.['avatar_url']"
            alt="Profile"
            width="30"
            height="30"
          />
        } @else {
          <ng-icon hlm name="lucideUser" size="sm" />
        }
      </button>
    </iv-tooltip>
    <ng-template #profile>
      <hlm-menu variant="menubar" class="w-sm">
        <div class="flex flex-col gap-2 items-center justify-center p-4">
          @if (user_metadata()) {
            <p class="mb-8 text-gray-600 dark:text-gray-400">
              {{ user_metadata()?.['email'] }}
            </p>
            <img
              class="rounded-full"
              [ngSrc]="user_metadata()?.['avatar_url']"
              alt="Profile"
              width="60"
              height="60"
            />
          }
          <p>{{ 'Hi, ' + user_name() + '! 👋' }}</p>
          <button
            hlmBtn
            size="sm"
            class="w-full mx-3 cursor-pointer relative"
            (click)="handleAuthAction()"
          >
            <img ngSrc="google-search.png" alt="Google" width="20" height="20" />
            {{ userLoggedIn() ? 'Log out' : 'Sign in with Google' }}
          </button>
        </div>
      </hlm-menu>
    </ng-template>
  `,
})
export class UserProfile {
  private userService = inject(UserService);
  userLoggedIn = computed(() => !!this.userService._session());
  user_metadata = computed(() => this.userService._session()?.user?.user_metadata);
  user_name = computed(() => this.user_metadata()?.['name'] || 'There');

  handleAuthAction() {
    if (this.userLoggedIn()) {
      this.userService.signOut();
    } else {
      this.userService.signIn();
    }
  }
}
