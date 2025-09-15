import { AfterViewInit, Component, inject, signal, viewChild } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideDelete, lucidePencil } from '@ng-icons/lucide';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';
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
import { TaskService } from '../../services/task.service';
import { TasksLocalService } from '../../services/tasks-local.service';

@Component({
  selector: 'local-tasks-dialog',
  providers: [provideIcons({ lucideDelete, lucideChevronDown, lucidePencil })],
  imports: [
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
  ],
  template: `
    <hlm-alert-dialog #promtDialog>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx" #ctx>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>Do you want to sync your local tasks with your account?</h2>
          <p hlmAlertDialogDescription>
            You have a total of {{ _localTasks().length }} tasks locally to sync. Never loose them
            again.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel (click)="handleMaybelater(); ctx.close()">
            Maybe, Later!
          </button>
          <button hlmAlertDialogAction (click)="saveTasks()">
            {{ action() }}
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class SaveLocalTasksDialog implements AfterViewInit {
  _localTasks = inject(TasksLocalService)._tasks;
  preference = inject(TasksLocalService)._preference;
  private taskService = inject(TaskService);

  readonly action = signal<string>('Yes, Please!');
  private readonly _dialogRef = viewChild<HlmAlertDialog>('promtDialog');

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.preference() && this._localTasks().length > 0) {
        this._dialogRef()?.open();
      }
    }, 2000);
  }

  handleMaybelater() {
    this.preference.set(true);
  }

  saveTasks() {
    this.action.set('Syncing...');
    this.taskService.syncLocalTasksToSupabase().subscribe({
      complete: () => {
        this.action.set('Yes, Please!');
        this._dialogRef()?.close();
      },
      error: () => {
        this.action.set('Try Again');
      },
    });
  }
}
