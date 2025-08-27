import { Component, inject, model, effect } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideLeaf, lucidePencil, lucideFlame, lucideActivity } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmInput } from '@spartan-ng/helm/input';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTooltipTrigger } from '@spartan-ng/helm/tooltip';
import { EditDialog } from './edit-dialog';
import { AlertDialog } from './alert-dialog';
import { AddTask } from './add-task';
import { isToday, TaskService } from '../../services/task.service';
import { DatePipe, NgClass } from '@angular/common';
import { Priority, Status } from '../../core/models/task.interface';
import { Task } from '../../services/supabase/tasks.supabase';
import { HighlightBadge } from '../../directives/new-highlight';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'spartan-all-tasks',
  imports: [
    BrnCommandImports,
    HlmCommandImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmCardImports,
    HighlightBadge,
    HlmTooltipTrigger,
    NgClass,
    HlmInput,
    EditDialog,
    AlertDialog,
    AddTask,
    DatePipe,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucideCheck, lucideLeaf, lucidePencil, lucideFlame, lucideActivity })],
  template: `
    <section>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Tasks</h2>
        <add-task />
      </div>

      <div class="my-8 flex flex-col sm:flex-row items-center gap-4">
        <input
          hlmInput
          placeholder="Search tasks..."
          (input)="onSearch($event)"
          class="w-full sm:flex-grow text-base p-2 rounded-md border-input"
        />
        <div class="grid gap-2 flex-1">
          <brn-select
            (valueChange)="onFilter($event)"
            class="inline-block w-48"
            placeholder="Priority"
            multiple
          >
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
        <div class="grid gap-2 flex-1">
          <brn-select
            class="inline-block"
            (valueChange)="onStatusFilter($event)"
            placeholder="Status"
            multiple
          >
            <hlm-select-trigger class="w-48">
              <hlm-select-value />
            </hlm-select-trigger>
            <hlm-select-content>
              <hlm-option value="new">New</hlm-option>
              <hlm-option value="pending">Pending</hlm-option>
              <hlm-option value="completed">Completed</hlm-option>
              <hlm-option value="archived">Archived</hlm-option>
            </hlm-select-content>
          </brn-select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        @for (task of tasks(); track task.id) {
        <section
          hlmCard
          class="group"
          [highlightBadge]="isTaskNew(task.createdAt)"
          [ngClass]="{
            'border-green-500 shadow-md': task.completed,
            'opacity-60': task.archived,
            'w-full transition-all duration-200': true,
          }"
        >
          <div hlmCardContent class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-auto min-w-0">
              <div class="flex flex-col w-full">
                <div class="flex gap-2 items-center flex-auto min-w-0">
                  <span class="flex-shrink-0">
                    @if (task.priority === 'High') { <ng-icon hlmTooltipTrigger="High" hlm name="lucideFlame" color="red" fill /> }
                    @if (task.priority === 'Medium') { <ng-icon  hlmTooltipTrigger="Medium" hlm name="lucideActivity" color="orange" /> }
                    @if (task.priority === 'Low') { <ng-icon  hlmTooltipTrigger="Low" hlm name="lucideLeaf" color="green" /> }
                  </span>
                  <div class="flex-1 min-w-0">
                    @if (task.url) {
                    <a
                      href="{{ task.url }}"
                      target="_blank"
                      rel="noopener"
                      class="block text-lg font-semibold text-blue-600 hover:underline truncate cursor-pointer"
                      [ngClass]="{ 'line-through text-gray-500': task.completed }"
                    >
                      {{ task.description }}
                    </a>
                    } @else {
                    <h3
                      [hlmTooltipTrigger]="task.description"
                      [aria-describedby]="task.description"
                      class="block text-lg font-semibold truncate"
                      [ngClass]="{ 'line-through text-gray-500': task.completed }"
                    >
                      {{ task.description }}
                    </h3>
                    }
                  </div>
                </div>

                @if (task.reminderTime) {
                <p class="text-sm text-gray-500">
                  Due: {{ task.reminderTime | date : 'MMM d, y, h:mm a' }}
                </p>
                }
              </div>
            </div>

            <div
              class='flex items-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            >
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
      console.log(this.filter$());
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this._taskService.setSearchQuery(query);
  }

  // TODO: Handle moving a task to archives. in UI as well.

  // TODO: Attach this to spart-ui select.
  onFilter(priorities: Priority[]) {
    console.log(priorities);
    this._taskService.setPriorityFilters(priorities);
  }

  onStatusFilter(statuses: Status[]) {
    console.log(statuses);
    this._taskService.setStatusFilters(statuses);
  }

  // TODO: Use this at the right time - in the right usecase
  onRescheduleReminder(task: Task, newReminderTime: Date) {
    const updatedTask = { ...task, reminderTime: newReminderTime };
    // this._taskService.rescheduleReminder(null);
  }

  isTaskNew(createdAt: string | Date) {
    return isToday(createdAt);
  }
}
