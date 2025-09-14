import { Component, OnDestroy, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucidePencil,
  lucideArchive,
  lucideClock,
} from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { TaskFormService } from '../../services/task-form';

export interface StatusFields {
  completed: boolean;
  archived: boolean;
}

@Component({
  selector: 'status-fields-section',
  imports: [
    ReactiveFormsModule,
    HlmLabel,
    HlmButton,
    NgIcon,
    BrnSelectImports,
    HlmSelectImports,
    HlmFormFieldModule,
  ],
  providers: [
    provideIcons({ lucideCheck, lucideChevronDown, lucidePencil, lucideArchive, lucideClock }),
  ],
  template: `
    <div hlmFormField class="grid gap-2 w-full">
      <span hlmLabel>Status</span>
      <div class="flex gap-3">
        <button
          hlmBtn
          size="sm"
          variant="outline"
          [disabled]="_archived()"
          (click)="toggleCompleted()"
          type="button"
        >
          <ng-icon name="lucideCheck" class="mr-1" />
          {{ _completed() ? 'Completed' : 'Mark Complete' }}
        </button>

        <button hlmBtn size="sm" variant="outline" (click)="toggleArchived()" type="button">
          <ng-icon name="lucideArchive" class="mr-1" />
          {{ _archived() ? 'Archived' : 'Archive' }}
        </button>
      </div>
      <p class="text-xs text-gray-500">You cannot mark an archived task as completed.</p>
    </div>
  `,
})
export class StatusFieldsSection implements OnDestroy {
  private _taskFormService = inject(TaskFormService);
  protected _completed = signal(this._taskFormService.taskGroup.get('completed')?.value ?? false);
  protected _archived = signal(this._taskFormService.taskGroup.get('archived')?.value ?? false);

  toggleCompleted() {
    const archived = this._archived();
    if (!archived) {
      this._completed.update((c) => !c);
    }
  }

  toggleArchived() {
    this._archived.update((a) => !a);
  }

  statusValuesChangeEffect = effect(() => {
    this._taskFormService.patchStatusValuesToTaskGroup({
      completed: this._completed(),
      archived: this._archived(),
    });
  });

  ngOnDestroy(): void {
    this.statusValuesChangeEffect.destroy();
  }
}
