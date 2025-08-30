import { hlmH3 } from './../../../../libs/spartan-ui/ui-typography-helm/src/lib/hlm-h3';
import { hlmH4 } from './../../../../libs/spartan-ui/ui-typography-helm/src/lib/hlm-h4';
import { Invalid } from './../../../../node_modules/@types/luxon/src/_util.d';
import { Component, computed, effect, inject, Signal, signal, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePlus, lucidePencil } from '@ng-icons/lucide';
import { BrnDialogContent, BrnDialogRef, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import {
  HlmDialog,
  HlmDialogContent,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { Priority, TaskInsert } from '../../core/models/task.interface';
import { TaskService } from '../../services/task.service';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import {
  HlmAccordion,
  HlmAccordionItem,
  HlmAccordionTrigger,
  HlmAccordionIcon,
  HlmAccordionContent,
} from '@spartan-ng/helm/accordion';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, mergeMap, Observable, of } from 'rxjs';
import {
  urlForbiddenValidator,
  urlValidator,
  titleValidator,
} from '../../validators/url-validator.validator';
import { isFullUrl } from '../../utils';

/**
 * Your default reminder time is 24 hours from now.
 * Tomorrow
 */
export const DEFAULT_REMINDER_AT = 24 * 60 * 60 * 1000;

@Component({
  selector: 'add-task',
  imports: [
    BrnDialogTrigger,
    BrnDialogContent,
    HlmDatePicker,
    ReactiveFormsModule,
    HlmDialog,
    HlmDialogContent,
    HlmDialogHeader,
    HlmDialogFooter,
    BrnSelectImports,
    HlmSelectImports,
    HlmDialogTitle,
    HlmFormFieldModule,
    HlmAccordion,
    HlmAccordionItem,
    HlmAccordionTrigger,
    HlmAccordionIcon,
    HlmAccordionContent,
    HlmLabel,
    HlmInput,
    HlmButton,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucideCheck, lucidePlus, lucidePencil })],
  template: `
    <hlm-dialog #dialog class="w-full">
      <button brnDialogTrigger #dialogTrigger id="add-task" hlmBtn size="sm">
        <ng-icon hlm size="sm" name="lucidePlus" />
        Add Task
      </button>
      <hlm-dialog-content class="sm:max-w-full" *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h2 hlmDialogTitle class="text-2xl font-bold mb-2 text-center">Quick Add Task</h2>
        </hlm-dialog-header>
        <form class="flex flex-col gap-6 w-md" [formGroup]="taskGroup">
          <hlm-form-field>
            <input
              hlmInput
              required
              type="text"
              id="title"
              formControlName="title"
              placeholder="Add a new task or paste a URL"
            />
            <hlm-error>{{ titleError() }}</hlm-error>
          </hlm-form-field>
          <div hlmAccordion class="w-full">
            <div hlmAccordionItem>
              <button hlmAccordionTrigger>
                <h4 class="font-semibold">Additional Options</h4>
                <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
              </button>
              <hlm-accordion-content>
                <hlm-form-field class="p-1">
                  <input
                    hlmInput
                    type="text"
                    id="url"
                    formControlName="url"
                    placeholder="Add an URL (Optional)"
                  />
                  <hlm-error>Invalid URL.</hlm-error>
                </hlm-form-field>
                <hlm-form-field class="p-1">
                  <input
                    hlmInput
                    type="text"

                    id="description"
                    formControlName="description"
                    placeholder="Add a description (Optional)"
                  />
                  <!-- </textarea> -->
                  <hlm-error>No URLs allowed.</hlm-error>
                </hlm-form-field>
                <div class="flex gap-4">
                  <div class="grid gap-2 flex-1">
                    <label hlmLabel for="priority">Priority</label>
                    <hlm-form-field>
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
                        [min]="minDate"
                        autoCloseOnSelect
                        formControlName="reminderTime"
                        class="w-full"
                      >
                        <span>Select date</span>
                      </hlm-date-picker>
                    </div>
                  </div>
                </div>
              </hlm-accordion-content>
            </div>
          </div>
        </form>
        <hlm-dialog-footer>
          <button hlmBtn type="submit" (click)="addTask()" [disabled]="taskGroup.invalid">
            {{ submitTask() }}
          </button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AddTask {
  private _taskService = inject(TaskService);
  tasks = this._taskService.filteredTasks;
  private readonly _dialogRef = viewChild<HlmDialog>('dialog');

  minDate = new Date();
  taskGroup = inject(NonNullableFormBuilder).group({
    title: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(120), titleValidator()],
    ],
    url: ['', urlValidator()],
    description: ['', urlForbiddenValidator()],
    priority: 'Low',
    reminderTime: new Date(),
    archived: false,
    completed: false,
  });

  title$: Observable<string | null> = this.taskGroup.get('title')?.valueChanges ?? of(null);
  title = toSignal(this.title$);
  titleErrors = toSignal(this.title$.pipe(map(() => this.taskGroup.get('title')?.errors ?? null)));

  submitTask = signal<string>('Submit');

  titleError = computed(() => {
    const titleErrors = this.titleErrors();
    if (titleErrors) {
      if (titleErrors['titleMixedUrl']) {
        return 'Title cannot contain both URL and text';
      }
      if (titleErrors['required']) {
        return 'Title is required';
      }
    }
    return undefined;
  });

  constructor() {
    effect(() => {
      const title = this.title();
      if (title && isFullUrl(title)) {
        this.taskGroup.get('url')?.setValue(title.trim());
      }
    });
  }

  addTask() {
    this.submitTask.set('Submitting...');
    if (this.taskGroup.valid) {
      const formData = this.taskGroup.getRawValue();

      // TODO: Duplicate in edit-task.ts
      let finalReminderTime: string | null = null;
      if (formData.reminderTime) {
        const reminderDateTime = new Date(formData.reminderTime);
        // Every final remainder time is at 9 AM
        reminderDateTime.setHours(9, 0, 0, 0);
        finalReminderTime = reminderDateTime.toISOString();
      }

      const newTask: TaskInsert = {
        ...formData,
        reminderTime: finalReminderTime,
      };

      this._taskService.addTask(newTask).subscribe({
        next: (res) => {
          this.taskGroup.reset();
          this.submitTask.set('Submit');
        },
        error: (er) => console.log('Something went wrong!', er),
        complete: () => {
          this._dialogRef()?.close();
        },
      });
    }
  }
}
