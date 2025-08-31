import { Component, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePencil, lucidePlus } from '@ng-icons/lucide';
import { BrnDialogContent, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDialog,
  HlmDialogContent,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { TaskFormService } from '../../services/task-form';
import { TaskService } from '../../services/task.service';
import { TaskForm } from '../shared/task-form';

@Component({
  selector: 'add-task',
  imports: [
    BrnDialogTrigger,
    BrnDialogContent,
    ReactiveFormsModule,
    HlmDialog,
    HlmDialogContent,
    HlmDialogHeader,
    HlmDialogFooter,
    BrnSelectImports,
    HlmSelectImports,
    HlmDialogTitle,
    HlmFormFieldModule,
    HlmButton,
    NgIcon,
    HlmIcon,
    TaskForm,
  ],
  providers: [TaskFormService, provideIcons({ lucideCheck, lucidePlus, lucidePencil })],
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
        <task-form></task-form>
        <hlm-dialog-footer>
          <button hlmBtn type="submit" (click)="addTask()" [disabled]="invalidTaskForm()">
            {{ submitTask() }}
          </button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AddTask {
  private _taskService = inject(TaskService);
  private _taskFormService = inject(TaskFormService);
  invalidTaskForm = this._taskFormService._invalidTaskForm;

  private readonly _dialogRef = viewChild<HlmDialog>('dialog');
  submitTask = signal<string>('Submit');

  addTask() {
    if (!this.invalidTaskForm()) {
      this.submitTask.set('Submitting...');
      const newTask = this._taskFormService.constructTaskInsert();

      this._taskService.addTask(newTask).subscribe({
        next: () => {
          this.submitTask.set('Submit');
          this._taskFormService.taskGroup.reset();
          this._dialogRef()?.close();
        },
        error: (er) => console.log('Something went wrong!', er),
      });
    }
  }
}
