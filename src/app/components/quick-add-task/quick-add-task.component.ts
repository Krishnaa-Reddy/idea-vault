import { Component, inject } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButton } from '@spartan-ng/helm/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmRadioGroup, HlmRadio } from '@spartan-ng/helm/radio-group';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { Priority } from '../../core/models/task.interface';
import { TaskService } from '../../services/task.service';
import { Task, TaskInsert } from '../../services/supabase/tasks.supabase';

@Component({
  selector: 'app-quick-add-task',
  imports: [
    HlmInput,
    HlmButton,
    ReactiveFormsModule,
    HlmLabel,
    HlmRadioGroup,
    HlmRadio,
    HlmDatePicker
],
  template: `

    <div class="max-w-md mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-xl animate-fade-in-down">
      <h2 class="text-2xl font-bold mb-6 text-center">Quick Add Task</h2>

      <div class="mb-4">
        <input hlmInput placeholder="Add a new task or paste a URL" [formControl]="taskControl" class="w-full text-lg p-3 rounded-md border-input focus:ring-2 focus:ring-primary-foreground focus:border-transparent transition-all duration-200" />
      </div>

      <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex flex-col gap-2">
          <label hlmLabel class="text-sm font-medium">Priority</label>
          <hlm-radio-group orientation="horizontal" [formControl]="priorityControl" class="flex gap-4">
            <div class="flex items-center space-x-2">
              <hlm-radio value="High" id="r1" class="border-red-500 text-red-500" />
              <label hlmLabel for="r1" class="text-red-500">High</label>
            </div>
            <div class="flex items-center space-x-2">
              <hlm-radio value="Medium" id="r2" class="border-orange-500 text-orange-500" />
              <label hlmLabel for="r2" class="text-orange-500">Medium</label>
            </div>
            <div class="flex items-center space-x-2">
              <hlm-radio value="Low" id="r3" class="border-blue-500 text-blue-500" />
              <label hlmLabel for="r3" class="text-blue-500">Low</label>
            </div>
          </hlm-radio-group>
        </div>

        <div class="flex flex-col gap-2">
          <label hlmLabel class="text-sm font-medium">Reminder Time</label>
          <div class="flex gap-2">
            <hlm-date-picker [formControl]="reminderDateControl" class="w-48 p-3 rounded-md border-input" />
            <input hlmInput type="time" [formControl]="reminderTimeControl" class="w-24 p-3 rounded-md border-input" />
          </div>
        </div>
      </div>
      <button hlmBtn (click)="addTask()" [disabled]="taskControl.invalid" class="w-full py-3 text-lg font-semibold bg-gradient-to-r from-primary-foreground to-primary-background text-primary-text rounded-md hover:from-primary-background hover:to-primary-foreground transition-all duration-300 transform hover:scale-105 active:scale-95">
        Add Task
      </button>
    </div>
  `,
  styles: [`
    @keyframes fade-in-down {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-down {
      animation: fade-in-down 0.5s ease-out forwards;
    }
  `]
})
export class QuickAddTaskComponent {
  taskControl = new FormControl('', Validators.required);
  priorityControl = new FormControl('Medium' as Priority, Validators.required);
  reminderDateControl = new FormControl<Date | null>(null);
  reminderTimeControl = new FormControl<string | null>(null);

  private _taskService = inject(TaskService);

  constructor() {
    const tomorrow = new Date();
    new Date().setDate(tomorrow.getDate() + 1);
    this.reminderDateControl.setValue(tomorrow);
    this.reminderTimeControl.setValue('09:00');
  }

  addTask() {
    if (this.taskControl.valid && this.priorityControl.valid) {
      const description = this.taskControl.value!;
      const priority = this.priorityControl.value! as Priority;
      const reminderDate = this.reminderDateControl.value;
      const reminderTime = this.reminderTimeControl.value;

      let finalReminderTime: Date | undefined;
      if (reminderDate && reminderTime) {
        const [hours, minutes] = reminderTime.split(':').map(Number);
        finalReminderTime = new Date(reminderDate);
        finalReminderTime.setHours(hours, minutes, 0, 0);
      }

      const newTask: TaskInsert = {
        description: description,
        priority: priority,
        reminderTime: 'as',
        completed: false,
        archived: false,
        // TODO: not just starts with. but also has to be anywhere in the the entire description
        url: description.startsWith('http') ? description : undefined,
      };

      this._taskService.addTask(newTask);

      this.taskControl.reset();
      this.priorityControl.setValue('Medium');
      this.reminderDateControl.setValue(null);
      this.reminderTimeControl.setValue('09:00');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // this.reminderDateControl.setValue(tomorrow);
      // this.reminderTimeControl.setValue('09:00');
    }
  }
}
