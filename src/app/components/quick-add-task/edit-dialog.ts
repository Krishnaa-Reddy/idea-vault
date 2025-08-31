import { AfterViewInit, Component, inject, input, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideCheck,
  lucideChevronDown,
  lucideClock,
  lucidePencil,
} from '@ng-icons/lucide';
import { BrnDialogContent, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDialog,
  HlmDialogContent,
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { Task } from '../../core/models/task.interface';
import { TaskFormService } from '../../services/task-form';
import { TaskService } from '../../services/task.service';
import { StatusFieldsSection } from '../shared/status-fiels-section';
import { TaskForm } from '../shared/task-form';

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
    HlmButton,
    NgIcon,
    HlmIcon,
    BrnSelectImports,
    HlmSelectImports,
    HlmFormFieldModule,
    TaskForm,
    StatusFieldsSection,
  ],
  providers: [
    TaskFormService,
    provideIcons({ lucideCheck, lucideChevronDown, lucidePencil, lucideArchive, lucideClock }),
  ],
  template: `
    <hlm-dialog #dialog class="w-full">
      <button brnDialogTrigger hlmBtn size="icon" variant="secondary" class="size-8">
        <ng-icon hlm size="sm" name="lucidePencil" />
      </button>

      <hlm-dialog-content class="sm:max-w-full" *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Edit Task</h3>
          <p hlmDialogDescription>Update task details below.</p>
        </hlm-dialog-header>
        <task-form>
          <status-fields-section></status-fields-section>
        </task-form>

        <hlm-dialog-footer>
          <button hlmBtn type="submit" (click)="editTask()" [disabled]="invalidTaskForm()">
            {{ editText() }}
          </button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class EditDialog implements AfterViewInit {
  task = input.required<Task>();
  private _tasks = inject(TaskService);
  private _taskFormService = inject(TaskFormService);
  invalidTaskForm = this._taskFormService._invalidTaskForm;

  private readonly _dialogRef = viewChild<HlmDialog>('dialog');

  editText = signal('Save changes');

  ngAfterViewInit(): void {
    this._taskFormService.constructTaskGroupFromTask(this.task());
  }

  editTask() {
    if (!this.invalidTaskForm()) {
      this.editText.set('Saving...');
      this._tasks
        .updateTask(this._taskFormService.constructTaskUpdateFromTaskId(this.task().id))
        .subscribe({
          next: () => {
            this.editText.set('Save changes');
            this._dialogRef()?.close();
          },
          error: (er) => console.log('Something went wrong!', er),
        });
    }
  }
}
