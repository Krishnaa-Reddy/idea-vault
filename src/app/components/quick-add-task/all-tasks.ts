import { DATE_FORMAT } from './../../app';
import { Component, inject, model } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideLeaf,
  lucidePencil,
  lucideFlame,
  lucideActivity,
  lucideClock,
} from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmInput } from '@spartan-ng/helm/input';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { EditDialog } from './edit-dialog';
import { AlertDialog } from './alert-dialog';
import { AddTask } from './add-task';
import { isToday, TaskService } from '../../services/task.service';
import { DatePipe, NgClass } from '@angular/common';
import { Priority, Status } from '../../core/models/task.interface';
import { HighlightBadge } from '../../directives/new-highlight';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { BrnTooltipContentTemplate } from '@spartan-ng/brain/tooltip';
import { HlmTooltip, HlmTooltipTrigger } from '@spartan-ng/helm/tooltip';

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
    HlmTooltip,
    NgClass,
    HlmInput,
    EditDialog,
    AlertDialog,
    AddTask,
    DatePipe,
    NgIcon,
    HlmIcon,
    HlmSkeleton,
    BrnTooltipContentTemplate,
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
        @if (tasksLoading()) {
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
        } @else if (tasksError()) {
          <p class="text-muted-foreground text-center col-span-full">
            Something's wrong. Please try later.
          </p>
        } @else {
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
              <div hlmCardContent class="flex flex-col">
                <div class="flex items-end justify-between gap-3 w-full">
                  <div class="flex items-center gap-2 min-w-0 flex-1">
                    @if (priorityIcon(task.priority); as prio) {
                      <span class="flex-shrink-0">
                        <ng-icon
                          hlm
                          [hlmTooltipTrigger]="task.priority"
                          [name]="prio.icon"
                          [color]="prio.color"
                        />
                      </span>
                    }
                    <div class="flex-1 min-w-0">
                      @if (task.url) {
                        <a
                          href="{{ task.url }}"
                          target="_blank"
                          rel="noopener"
                          class="block text-lg font-semibold text-blue-600 hover:underline truncate cursor-pointer"
                          [ngClass]="{ 'line-through text-gray-500': task.completed }"
                        >
                          {{ task.title }}
                        </a>
                      } @else {
                        <h3
                          [hlmTooltipTrigger]="task.description"
                          [aria-describedby]="task.title"
                          class="block text-lg font-semibold truncate"
                          [ngClass]="{ 'line-through text-gray-500': task.completed }"
                        >
                          {{ task.title }}
                        </h3>
                      }
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <edit-task-dialog [task]="task" />
                    <alert-dialog [task]="task" />
                  </div>
                </div>
                @if (task.description) {
                  <hlm-tooltip>
                    <div class="text-sm text-muted-foreground truncate italic" hlmTooltipTrigger>
                      {{ task.description }}
                    </div>
                    <div
                      *brnTooltipContent
                      class="max-w-xl break-words whitespace-pre-line text-wrap italic"
                    >
                      {{ task.description }}
                    </div>
                  </hlm-tooltip>
                }
                @if (task.reminderTime) {
                  <div class="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <ng-icon name="lucideClock" class="w-4 h-4 text-gray-400" />
                    <span>
                      Due:
                      <span class="font-medium text-gray-700">
                        {{ task.reminderTime | date: _dateFormat }}
                      </span>
                    </span>
                  </div>
                }
              </div>
            </section>
          } @empty {
            <p class="text-muted-foreground text-center col-span-full">
              No tasks found. Add one to proceed!
            </p>
          }
        }
      </div>
    </section>
  `,
})
export class TasksComponent {
  private _taskService = inject(TaskService);
  tasks = this._taskService.filteredTasks;
  tasksLoading = this._taskService.tasksLoading;
  tasksError = this._taskService.tasksError;

  protected readonly _dateFormat = DATE_FORMAT;

  filter$ = model([]);

  priorityIcon(priority: string) {
    switch (priority) {
      case 'High':
        return { icon: 'lucideFlame', color: 'red', fill: true };
      case 'Medium':
        return { icon: 'lucideActivity', color: 'orange' };
      case 'Low':
        return { icon: 'lucideLeaf', color: 'green' };
      default:
        return null;
    }
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
