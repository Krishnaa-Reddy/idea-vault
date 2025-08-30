import { Component, effect, inject, input, linkedSignal, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucidePencil,
  lucideArchive,
  lucideClock,
} from '@ng-icons/lucide';
import { BrnDialogContent, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDialog,
  HlmDialogContent,
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { TaskService } from '../../services/task.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { Priority, Task } from '../../core/models/task.interface';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAccordion, HlmAccordionItem, HlmAccordionTrigger, HlmAccordionIcon, HlmAccordionContent } from '@spartan-ng/helm/accordion';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
  selector: 'edit-task-dialog',
  standalone: true,
  imports: [
    BrnDialogTrigger,
    BrnDialogContent,
    ReactiveFormsModule,
    HlmDialog,
    HlmDialogContent,
    HlmDialogHeader,
    HlmDialogFooter,
    HlmDialogTitle,
    HlmDialogDescription,
    HlmLabel,
    HlmInput,
    HlmButton,
    NgIcon,
    HlmIcon,
    HlmDatePicker,
    BrnSelectImports,
    HlmSelectImports,
    HlmFormFieldModule,
    HlmAccordion,
    HlmAccordionItem,
    HlmAccordionTrigger,
    HlmAccordionIcon,
    HlmAccordionContent,
  ],
  providers: [
    provideIcons({ lucideCheck, lucideChevronDown, lucidePencil, lucideArchive, lucideClock }),
  ],
  template: `
    <hlm-dialog #dialog class="w-full">
      <button brnDialogTrigger hlmBtn size="icon" variant="secondary" class="size-8">
        <ng-icon hlm size="sm" name="lucidePencil" />
      </button>

      <!-- Content -->
      <hlm-dialog-content class="sm:max-w-full" *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Edit Task</h3>
          <p hlmDialogDescription>Update task details below.</p>
        </hlm-dialog-header>

        <form class="flex flex-col gap-4 w-md" [formGroup]="taskGroup" autocomplete="off">
          <hlm-form-field class="w-full">
            <input
              hlmInput
              required
              type="text"
              id="title"
              formControlName="title"
              placeholder="Your task or an URL"
              class="w-full"
            />
            <hlm-error>Title or Url is required.</hlm-error>
          </hlm-form-field>
          <div class="grid gap-2 w-full">
            <label hlmLabel>Status</label>
            <div class="flex gap-3">
              <button
                hlmBtn
                size="sm"
                variant="outline"
                [class.bg-green-100]="taskGroup.get('completed')?.value"
                [disabled]="taskGroup.get('archived')?.value"
                (click)="toggleCompleted()"
                type="button"
              >
                <ng-icon name="lucideCheck" class="mr-1" />
                {{ taskGroup.get('completed')?.value ? 'Completed' : 'Mark Complete' }}
              </button>

              <button
                hlmBtn
                size="sm"
                variant="outline"
                [class.bg-gray-200]="taskGroup.get('archived')?.value"
                (click)="toggleArchived()"
                type="button"
              >
                <ng-icon name="lucideArchive" class="mr-1" />
                {{ taskGroup.get('archived')?.value ? 'Archived' : 'Archive' }}
              </button>
            </div>
            <p class="text-xs text-gray-500">
              You cannot mark an archived task as completed.
            </p>
          </div>
          <div hlmAccordion class="w-full">
            <div hlmAccordionItem>
              <button hlmAccordionTrigger>
                <h4 class="font-semibold">Additional Options</h4>
                <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
              </button>
              <hlm-accordion-content>
                <div class="flex flex-col gap-4 w-full">
                  <hlm-form-field class="w-full">
                    <input
                      hlmInput
                      type="text"
                      id="url"
                      formControlName="url"
                      placeholder="An URL (Optional)"
                      class="w-full"
                    />
                    <hlm-error>Invalid URL.</hlm-error>
                  </hlm-form-field>
                  <hlm-form-field class="w-full">
                    <textarea
                      class="min-h-[80px] w-full"
                      hlmInput
                      type="text"
                      id="description"
                      formControlName="description"
                      placeholder="Your description (Optional)"
                    ></textarea>
                    <hlm-error>No URLs allowed.</hlm-error>
                  </hlm-form-field>
                  <div class="flex flex-col sm:flex-row gap-4 w-full">
                    <div class="grid gap-2 flex-1">
                      <label hlmLabel for="priority">Priority</label>
                      <hlm-form-field class="w-full">
                        <brn-select
                          formControlName="priority"
                          class="inline-block w-full"
                          placeholder="Select an option"
                        >
                          <hlm-select-trigger class="w-full flex">
                            <hlm-select-value />
                          </hlm-select-trigger>
                          <hlm-select-content>
                            <hlm-option value="High">High</hlm-option>
                            <hlm-option value="Medium">Medium</hlm-option>
                            <hlm-option value="Low">Low</hlm-option>
                          </hlm-select-content>
                        </brn-select>
                        <hlm-error>The priority is required</hlm-error>
                      </hlm-form-field>
                    </div>
                    <div class="grid gap-2 flex-1">
                      <label hlmLabel for="reminder">Reminder Date</label>
                      <div class="flex gap-2">
                        <hlm-date-picker
                          autoCloseOnSelect
                          formControlName="reminderTime"
                          class="w-full"
                        >
                          <span>Select date</span>
                        </hlm-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
              </hlm-accordion-content>
            </div>
          </div>
        </form>
        <!-- Footer -->
        <hlm-dialog-footer>
          <button hlmBtn type="submit" (click)="editTask()">{{ editText() }}</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class EditDialog {
  private _tasks = inject(TaskService);
  private readonly _dialogRef = viewChild<HlmDialog>('dialog');

  task = input.required<Task>();
  editText = signal('Save changes');
  taskDesc = linkedSignal(() => this.task().description);

  // Use taskGroup for all controls, including completed and archived
  taskGroup = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    url: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    priority: new FormControl<Priority>('Low', {
      nonNullable: true,
      validators: Validators.required,
    }),
    reminderTime: new FormControl<Date | null>(null),
    completed: new FormControl<boolean>(false, { nonNullable: true }),
    archived: new FormControl<boolean>(false, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const t = this.task();
      this.taskGroup.patchValue({
        title: t.title,
        url: t.url ?? null,
        description: t.description ?? null,
        priority: t.priority as Priority,
        reminderTime: t.reminderTime ? new Date(t.reminderTime) : null,
        completed: t.completed,
        archived: t.archived,
      }, { emitEvent: false });
    });
  }

  editTask() {
    this.editText.set('Saving...');

    const formValue = this.taskGroup.getRawValue();

    let updatedReminderTime: string | null = null;
    if (formValue.reminderTime) {
      const reminderDateTime = new Date(formValue.reminderTime);
      reminderDateTime.setHours(9, 0, 0, 0);
      updatedReminderTime = reminderDateTime.toISOString();
    }

    this._tasks
      .updateTask({
        id: this.task().id,
        title: formValue.title,
        url: formValue.url ?? undefined,
        description: formValue.description ?? undefined,
        priority: formValue.priority,
        completed: formValue.completed,
        archived: formValue.archived,
        reminderTime: updatedReminderTime,
      })
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.error(error),
        complete: () => {
          this.editText.set('Save changes');
          this._dialogRef()?.close();
        },
      });
  }

  toggleCompleted() {
    const archived = this.taskGroup.get('archived')?.value;
    if (!archived) {
      const completed = this.taskGroup.get('completed')?.value;
      this.taskGroup.get('completed')?.setValue(!completed);
    }
  }

  toggleArchived() {
    const archived = this.taskGroup.get('archived')?.value;
    this.taskGroup.get('archived')?.setValue(!archived);
  }
}
