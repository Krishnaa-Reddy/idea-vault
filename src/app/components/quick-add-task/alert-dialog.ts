import { Component, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDelete, lucideChevronDown, lucidePencil } from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import {
  HlmAlertDialog,
  HlmAlertDialogActionButton,
  HlmAlertDialogCancelButton,
  HlmAlertDialogContent,
  HlmAlertDialogDescription,
  HlmAlertDialogFooter,
  HlmAlertDialogHeader,
  HlmAlertDialogTitle,
} from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { TaskService } from '../../services/task.service';
import { Task } from '../../core/models/task.interface';

@Component({
  selector: 'alert-dialog',
  providers: [provideIcons({ lucideDelete, lucideChevronDown, lucidePencil })],
  imports: [
    BrnAlertDialogTrigger,
    BrnAlertDialogContent,
    HlmAlertDialog,
    HlmAlertDialogHeader,
    HlmAlertDialogFooter,
    HlmAlertDialogTitle,
    HlmAlertDialogDescription,
    HlmAlertDialogCancelButton,
    HlmAlertDialogActionButton,
    HlmAlertDialogContent,
    HlmButton,
    NgIcon,
    HlmIcon,
  ],
  template: `
    <hlm-alert-dialog>
      <button id="delete-task" brnAlertDialogTrigger hlmBtn variant="secondary">
        <ng-icon hlm size="sm" name="lucideDelete" />
      </button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx" #ctx>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>Are you absolutely sure?</h2>
          <p hlmAlertDialogDescription>
            This action cannot be undone. This will permanently delete your task.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
          <button hlmAlertDialogAction (click)="onDelete()" variant="destructive">
            {{ deletion() }}
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class AlertDialog {
  task = input.required<Task>();
  _tasks = inject(TaskService);

  readonly deletion = signal<string>('Delete');

  onDelete() {
    this.deletion.set('Deleting...');
    setTimeout(() => {
      this.deletion.set('Delete');
      this._tasks.deleteTask(this.task().id);
    }, 1000);
  }
}
