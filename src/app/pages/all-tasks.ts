import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideCheck,
  lucideClock,
  lucideFlame,
  lucideLeaf,
  lucidePencil,
} from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { DATE_FORMAT } from '../app';
import { AddTask } from '../components/quick-add-task/add-task';
import { SaveLocalTasksDialog } from '../components/quick-add-task/prompt-dialog';
import { TasksList } from '../components/quick-add-task/tasks-list';
import { Priority, Status } from '../core/models/task.interface';
import { isToday, TaskService } from '../services/task.service';
import { priorityIcon } from '../utils/priority-icon';

@Component({
  selector: 'all-tasks',
  imports: [
    BrnCommandImports,
    HlmCommandImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmCardImports,
    HlmInput,
    AddTask,
    HlmSkeleton,
    TasksList,
    SaveLocalTasksDialog,
  ],
  providers: [
    provideIcons({
      lucideCheck,
      lucideClock,
      lucideLeaf,
      lucidePencil,
      lucideFlame,
      lucideActivity,
    }),
  ],
  template: `
    <section>
      <local-tasks-dialog />
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div class="grid gap-2">
            <brn-select
              (valueChange)="onFilter($event)"
              class="inline-block w-full"
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
          <div class="grid gap-2">
            <brn-select
              class="inline-block w-full"
              (valueChange)="onStatusFilter($event)"
              placeholder="Status"
              multiple
            >
              <hlm-select-trigger class="w-full">
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
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        @if (tasksStatus() === 'loading') {
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <section hlmCard class="group w-full">
              <div hlmCardContent class="flex flex-col gap-3">
                <hlm-skeleton class="h-6 w-3/4" />
                <hlm-skeleton class="h-4 w-1/2" />
                <div class="flex items-center gap-2">
                  <hlm-skeleton class="h-4 w-1/4" />
                  <hlm-skeleton class="h-4 w-1/4" />
                </div>
              </div>
            </section>
          }
        } @else if (tasksStatus() === 'error') {
          <p class="text-muted-foreground text-center col-span-full">
            Something's wrong. Please try later.
          </p>
        } @else {
          <tasks-list [tasks]="tasks()" />
        }
      </div>
    </section>
  `,
})
export class TasksPage {
  private _taskService = inject(TaskService);
  tasks = this._taskService.filteredTasks;
  tasksStatus = this._taskService.status;

  protected readonly _dateFormat = DATE_FORMAT;

  priorityIcon(priority: string) {
    return priorityIcon(priority);
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this._taskService.setSearchQuery(query);
  }

  onFilter(priorities: Priority[]) {
    this._taskService.setPriorityFilters(priorities);
  }

  onStatusFilter(statuses: Status[]) {
    this._taskService.setStatusFilters(statuses);
  }

  isTaskNew(createdAt: string | Date) {
    return isToday(createdAt);
  }
}
