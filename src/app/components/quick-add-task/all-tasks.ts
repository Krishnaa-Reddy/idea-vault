import { Component, inject, model, effect } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucidePencil } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmInput } from '@spartan-ng/helm/input';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { EditDialog } from './edit-dialog';
import { AlertDialog } from './alert-dialog';
import { AddTask } from './add-task';
import { TaskService } from '../../core/services/task.service';
import { DatePipe, NgClass } from '@angular/common';
import { Task, Priority } from '../../core/models/task.interface';

@Component({
  selector: 'spartan-all-tasks',
  imports: [
    BrnCommandImports,
    HlmCommandImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmCardImports,
    NgClass,
    HlmInput,
    EditDialog,
    AlertDialog,
    AddTask,
    DatePipe,
  ],
  providers: [provideIcons({ lucideCheck, lucideChevronDown, lucidePencil })],
  template: `
    <section>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Tasks</h2>
        <add-task />
      </div>

      <div class="mb-6 flex flex-col sm:flex-row items-center gap-4 mt-6">
        <input
          hlmInput
          placeholder="Search tasks..."
          (input)="onSearch($event)"
          class="w-full sm:flex-grow text-base p-2 rounded-md border-input"
        />
        <div class="grid gap-2 flex-1">
          <brn-select (valueChange)="onFilter($event)" class="inline-block" placeholder="Priority" multiple>
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
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        @for (task of tasks(); track task.id) {
        <section
          hlmCard
          [ngClass]="{
            'border-green-500 shadow-md': task.completed,
            'opacity-80': task.archived,
            'w-full transition-all duration-200': true,
          }"
        >
          <div hlmCardContent class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex flex-col">
                <div class="flex gap-2 items-center">
                  <span>
                    @if (task.priority === 'High') { ⚡ } @if (task.priority === 'Medium') { ⏳ }
                    @if (task.priority === 'Low') { ✅ }
                  </span>

                  @if (task.url) {
                  <a
                    href="{{ task.url }}"
                    target="_blank"
                    [ngClass]="{
                      'text-lg font-semibold underline': true,
                      'line-through text-gray-500': task.completed
                    }"
                  >
                    {{ task.description }}
                  </a>
                  } @else {
                  <h3
                    [ngClass]="{
                      'text-lg font-semibold': true,
                      'line-through text-gray-500': task.completed
                    }"
                  >
                    {{ task.description }}
                  </h3>
                  }
                </div>

                @if (task.reminderTime) {
                <p class="text-sm text-gray-500">
                  Due: {{ task.reminderTime | date : 'MMM d, y, h:mm a' }}
                </p>
                }
              </div>
            </div>

            <div class="flex items-center gap-3">
              <edit-task-dialog [task]="task" />
              <alert-dialog [task]="task" />
            </div>
          </div>
        </section>
        } @empty {
        <p class="text-muted-foreground text-center col-span-full">
          No tasks found. Add one to proceed!
        </p>
        }
      </div>
    </section>
  `,
})
export class TasksComponent {
  private _taskService = inject(TaskService);
  tasks = this._taskService.filteredTasks;

  filter$ = model([]);


  constructor() {
    effect(() => {
       console.log(this.filter$())
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this._taskService.setSearchQuery(query);
  }

  // TODO: Handle moving a task to archives. in UI as well.

  // TODO: Attach this to spart-ui select.
  onFilter(priorities: Priority[]) {
    console.log(priorities)
    this._taskService.setFilterPriorities(priorities);
  }

  // TODO: Use this at the right time - in the right usecase
  onRescheduleReminder(task: Task, newReminderTime: Date) {
    const updatedTask = { ...task, reminderTime: newReminderTime };
    this._taskService.rescheduleReminder(updatedTask);
  }
}
