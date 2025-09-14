import { DatePipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { Task } from '../../core/models/task.interface';
import { HighlightBadge } from '../../directives/new-highlight';
import { isToday } from '../../services/task.service';
import { IvTooltipComponent } from '../shared/iv-tooltip';
import { DATE_FORMAT } from './../../app';
import { DeleteDialog } from './delete-dialog';
import { EditDialog } from './edit-dialog';

@Component({
  selector: 'tasks-list',
  imports: [
    BrnCommandImports,
    HlmCommandImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmCardImports,
    HighlightBadge,
    NgClass,
    EditDialog,
    DeleteDialog,
    DatePipe,
    NgIcon,
    HlmIcon,
    IvTooltipComponent,
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
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
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
                  <iv-tooltip [value]="task.priority">
                    <ng-icon hlm [name]="prio.icon" [color]="prio.color" />
                  </iv-tooltip>
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
            <iv-tooltip [value]="task.description">
              <div class="text-sm text-muted-foreground truncate italic">
                {{ task.description }}
              </div>
            </iv-tooltip>
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
  `,
})
export class TasksList {
  tasks = input.required<Task[]>();
  protected readonly _dateFormat = DATE_FORMAT;

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

  isTaskNew(createdAt: string | Date) {
    return isToday(createdAt);
  }
}
