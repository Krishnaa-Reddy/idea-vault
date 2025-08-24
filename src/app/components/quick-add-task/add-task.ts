import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePlus, lucidePencil } from '@ng-icons/lucide';
import { BrnDialogContent, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
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
import { Priority, Task } from '../../core/models/task.interface';
import { TaskService } from '../../core/services/task.service';

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
  providers: [provideIcons({ lucideCheck, lucidePlus, lucidePencil })],
  template: `
    <hlm-dialog class="w-full">
    <button brnDialogTrigger id="add-task" hlmBtn size="sm">
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
          <button hlmBtn type="submit"  (click)="addTask()" [disabled]="taskControl.invalid">{{submitTask()}}</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AddTask {

  private _taskService = inject(TaskService);
  tasks = this._taskService.filteredTasks;

  taskControl = new FormControl('', Validators.required);
  priorityControl = new FormControl('Medium' as Priority, Validators.required);
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

      let finalReminderTime: Date | undefined;
      if (reminderDate) {      
        finalReminderTime = new Date(reminderDate);
        finalReminderTime.setHours(9, 0, 0, 0);
      }

      const newTask: Task = {
        id: '',
        description: description,
        priority: priority,
        reminderTime: finalReminderTime,
        completed: false,
        archived: false,
        // TODO: not just starts with. but also has to be anywhere in the the entire description
        url: description.startsWith('http') ? description : undefined,
      };

      this._taskService.addTask(newTask);
      
      setTimeout(() => {
        this._taskService.addTask(newTask);
        this.taskControl.reset();
        this.priorityControl.setValue('Low');
        this.reminderDateControl.setValue(null);
        this.submitTask.set('Submit');
      }, 1000);
    }
  }


}
