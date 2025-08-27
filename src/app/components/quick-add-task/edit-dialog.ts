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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../services/supabase/tasks.supabase';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';

@Component({
  selector: 'edit-task-dialog',
  standalone: true,
  imports: [
    BrnDialogTrigger,
    ReactiveFormsModule,
    BrnDialogContent,
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
  ],
  providers: [
    provideIcons({ lucideCheck, lucideChevronDown, lucidePencil, lucideArchive, lucideClock }),
  ],
  template: `
    <hlm-dialog #dialog>
      <button brnDialogTrigger hlmBtn size="icon" variant="secondary" class="size-8">
        <ng-icon hlm size="sm" name="lucidePencil" />
      </button>

      <!-- Content -->
      <hlm-dialog-content class="sm:max-w-[450px]" *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Edit Task</h3>
          <p hlmDialogDescription>Update task details below.</p>
        </hlm-dialog-header>

        <div class="grid gap-4 py-4">
          <!-- Description -->
          <div class="grid gap-2">
            <label hlmLabel for="task">Task</label>
            <input
              id="task"
              hlmInput
              type="text"
              [formControl]="taskDescControl"
              placeholder="Add a new task or paste a URL"
            />
          </div>

          <div class="grid gap-2">
            <label hlmLabel for="reminder">Reminder Date</label>
            <div class="flex gap-2">
              <hlm-date-picker [formControl]="reminderControl">
                <span>Select date</span>
              </hlm-date-picker>
            </div>
          </div>

          <!-- Status Controls -->
          <div class="grid gap-2">
            <label hlmLabel>Status</label>
            <div class="flex gap-3">
              <button
                hlmBtn
                size="sm"
                variant="outline"
                [class.bg-green-100]="task().completed"
                [disabled]="task().archived"
                (click)="toggleCompleted()"
              >
                <ng-icon name="lucideCheck" class="mr-1" />
                {{ task().completed ? 'Completed' : 'Mark Complete' }}
              </button>

              <button
                hlmBtn
                size="sm"
                variant="outline"
                [class.bg-gray-200]="task().archived"
                [disabled]="task().completed"
                (click)="toggleArchived()"
              >
                <ng-icon name="lucideArchive" class="mr-1" />
                {{ task().archived ? 'Archived' : 'Archive' }}
              </button>
            </div>
            <p class="text-xs text-gray-500">
              You cannot mark an archived task as completed and vice versa.
            </p>
          </div>
        </div>

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
  taskDescControl = new FormControl('', Validators.required);
  reminderControl = new FormControl<Date | null>(null);
  editText = signal('Save changes');
  taskDesc = linkedSignal(() => this.task().description);

  constructor() {
    effect(() => {
      this.taskDescControl.setValue(this.task().description);
      const reminderTime = this.task().reminderTime;

      this.reminderControl.setValue(reminderTime != null ? new Date(reminderTime) : null);
    });
  }

  editTask() {
    this.editText.set('Saving...');
    this._tasks
      .updateTask({
        id: this.task().id,
        description: this.taskDescControl.value!,
        completed: this.task().completed,
        archived: this.task().archived,
        reminderTime: this.reminderControl.value
          ? new Date(this.reminderControl.value).toISOString()
          : null,
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
    if (!this.task().archived) {
      this.task().completed = !this.task().completed;
    }
  }

  toggleArchived() {
    if (!this.task().completed) {
      this.task().archived = !this.task().archived;
    }
  }
}
