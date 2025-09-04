import { Component, inject, model } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCross, lucideInfo, lucideSettings } from '@ng-icons/lucide';
import { BrnSheetClose, BrnSheetContent, BrnSheetTrigger } from '@spartan-ng/brain/sheet';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';

import { HlmLabel } from '@spartan-ng/helm/label';
import {
  HlmSheet,
  HlmSheetContent,
  HlmSheetDescription,
  HlmSheetFooter,
  HlmSheetHeader,
  HlmSheetTitle,
} from '@spartan-ng/helm/sheet';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { RemindersService } from '../../services/reminders.service';
import { ToasterService } from '../../services/toaster-service';
import { UserService } from '../../services/users';
import { IvTooltipComponent } from './iv-tooltip';

@Component({
  selector: 'iv-settings-sheet',
  imports: [
    BrnSheetTrigger,
    BrnSheetContent,
    BrnSheetClose,
    HlmSheet,
    HlmSheetContent,
    HlmSheetHeader,
    HlmSheetFooter,
    HlmSheetTitle,
    HlmSheetDescription,
    HlmButton,
    HlmLabel,
    NgIcon,
    HlmIcon,
    HlmSwitch,
    IvTooltipComponent,
  ],
  providers: [provideIcons({ lucideCross, lucideSettings, lucideInfo })],
  template: `
    <hlm-sheet side="right">
      <iv-tooltip value="Settings" [lazy]="true">
        <button hlmBtn size="icon" variant="secondary" class="size-8 cursor-pointer" brnSheetTrigger>
          <ng-icon hlm size="sm" name="lucideSettings" />
        </button>
      </iv-tooltip>
      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h3 hlmSheetTitle>Optional Configuration</h3>
          <p hlmSheetDescription>Feature flags and additional settings</p>
        </hlm-sheet-header>
        <div class="grid flex-1 auto-rows-min gap-6 px-4">
          <!-- <div class="grid gap-3 mb-4">
            <label hlmLabel for="text" class="text-right"
              >Gemini API Token (Not Yet Implemented)</label
            >
            <input
              hlmInput
              id="text"
              placeholder="Enter your Gemini API Token"
              class="col-span-3"
            />
          </div> -->
        </div>
        <hlm-sheet-footer>
          <div class="grid gap-4 my-6">
            <div class="flex items-center gap-2">
              <hlm-switch
                id="enable-smart-reminders"
                [(checked)]="reminderResource.value"
                (checkedChange)="handleChange($event)"
              />
              <label hlmLabel for="enable-smart-reminders" class="mb-0">Smart Reminders</label>
              <iv-tooltip [value]="'You will recieve daily reminders for your tasks, if enabled!'">
                <ng-icon hlm size="sm" name="lucideInfo" />
              </iv-tooltip>
            </div>
          </div>
          <button hlmBtn type="submit" (click)="enableSmartReminders(); ctx.close()">
            Save Changes
          </button>
          <button brnSheetClose hlmBtn variant="outline">Close</button>
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class SettingsSheet {
  checked = model(false);
  _toaster = inject(ToasterService);
  session = inject(UserService)._session;
  remindersService = inject(RemindersService);
  reminderResource = this.remindersService.reminderResource;

  handleChange(state: boolean) {
    if (state && !this.session()) {
      this._toaster.setToast({
        message: 'Please login to enable this feature',
        type: 'error',
        position: 'top-right',
      });
      setTimeout(() => {
        this.reminderResource.set(false);
      }, 200);
      return;
    }
    this.reminderResource.set(state);
  }

  enableSmartReminders() {
    this.remindersService.updateTaskReminders(this.reminderResource.value()).subscribe();
  }
}
