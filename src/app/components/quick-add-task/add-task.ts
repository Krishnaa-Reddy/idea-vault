import { Component, inject, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Priority } from '../../core/models/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskInsert } from '../../services/supabase/tasks.supabase';

/**
 * You will be reminded at <specified-time>
 */
export const DEFAULT_REMINDER_AT = 9;

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
    HlmLabel,
    HlmInput,
    HlmButton,
    NgIcon,
    HlmIcon,
  ],
  providers: [
    provideIcons({ lucideCheck, lucidePlus, lucidePencil })
  ],
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
        <form>
          <div class="flex flex-col gap-6">
            <input type="text" id="task" [formControl]="taskControl"  hlmInput placeholder="Add a new task or paste a URL" />
            <div class="flex gap-4">
              <div class="grid gap-2 flex-1">
                <label hlmLabel for="priority">Priority</label>
                <brn-select [formControl]="priorityControl" class="inline-block" placeholder="Select an option">
                  <hlm-select-trigger class="w-full">
                    <hlm-select-value />
                  </hlm-select-trigger>
                  <hlm-select-content>
                    <hlm-option value="High">High</hlm-option>
                    <hlm-option value="Medium">Medium</hlm-option>
                    <hlm-option value="Low">Low</hlm-option>
                  </hlm-select-content>
                </brn-select>
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reminder">Reminder Date</label>
                <div class="flex gap-2">
                  <hlm-date-picker autoCloseOnSelect [formControl]="reminderDateControl">
                    <span>Select date</span>
                  </hlm-date-picker>
                </div>
              </div>
            </div>
          </div>
        </form>
        <hlm-dialog-footer>
          <button hlmBtn type="submit" (click)="addTask()" [disabled]="taskControl.invalid">{{submitTask()}}</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AddTask {

  private _taskService = inject(TaskService);
  tasks = this._taskService.filteredTasks;
  private readonly _dialogRef = viewChild<HlmDialog>('dialog');

  taskControl = new FormControl('', Validators.required);
  priorityControl = new FormControl('Low' as Priority, Validators.required);
  reminderDateControl = new FormControl<Date | null>(null);
  reminderTimeControl = new FormControl<string | null>(null);

  submitTask = signal<string>('Submit');

  constructor() { 
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.reminderDateControl.setValue(tomorrow);
  }

  addTask() {
    this.submitTask.set('Submitting...');
    if (this.taskControl.valid && this.priorityControl.valid) {
      const description = this.taskControl.value!;
      const priority = this.priorityControl.value! as Priority;
      const reminderDate = this.reminderDateControl.value;

      let finalReminderTime: Date | null = null;
      if (reminderDate) {
        finalReminderTime = new Date(reminderDate);
        finalReminderTime.setUTCHours(DEFAULT_REMINDER_AT, 0, 0, 0);
      }

      const newTask: TaskInsert = {
        description: description,
        completed: false,
        archived: false,
        priority: priority,
        url: description.startsWith('http') ? description : undefined,
        reminderTime: finalReminderTime ? finalReminderTime.toISOString() : null,
      };

      this._taskService.addTask(newTask).subscribe({
        next: res =>{
          this.taskControl.reset();
          this.priorityControl.setValue('Low');
          this.reminderDateControl.setValue(null);
          this.submitTask.set('Submit');
        },
        error: er => console.log("Soemthing went wrong!", er),
        complete: () => {
          this._dialogRef()?.close();
        }
      });
    }
  }


}
