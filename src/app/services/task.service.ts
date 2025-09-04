import { computed, effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Session } from '@supabase/supabase-js';
import { EMPTY, map, of, tap } from 'rxjs';
import { Priority, Status, Task, TaskInsert, TaskUpdate } from '../core/models/task.interface';
import { TasksSupabase } from './supabase/tasks.supabase';
import { TasksLocalService } from './tasks-local.service';
import { ToasterService } from './toaster-service';
import { UserService } from './users';

export const isToday = (date: string | Date) => {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === todayMidnight.getTime();
};

const matchStatus = (status: Status, task: Task) => {
  const statusChecks: Record<Status, (task: Task) => boolean> = {
    new: (t) => isToday(t.createdAt),
    completed: (t) => t.completed || false,
    archived: (t) => t.archived || false,
    pending: (t) => !isToday(t.createdAt) && !t.completed && !t.archived,
  };

  return statusChecks[status](task);
};

@Injectable({ providedIn: 'root' })
export class TaskService extends TasksSupabase {
  private toaster = inject(ToasterService);
  private tasksLocalService = inject(TasksLocalService);
  private userService = inject(UserService);

  _session = this.userService._session;

  handleError(error?: Error | null) {
    if (error) {
      this.toaster.setToast({
        message: error.message,
        dismissible: true,
        closeButton: true,
        type: 'warning',
      });
    }
  }

  private tasksResource = rxResource<Task[], Session | null>({
    stream: () => {
      if(!this._session()) return of(this.tasksLocalService._tasks());
      return this.select().pipe(
        tap((res) => this.handleError(res?.error)),
        map((res) => res?.data ?? []),
      );
    },
  }).asReadonly();

  status = this.tasksResource.status;

  private _tasks = linkedSignal<Task[]>(() => {
    if (this.tasksResource.hasValue()) return this.tasksResource.value();
    return [];
  });

  constructor() {
    super();
    effect(() => {
      if (!this._session()) this._tasks.set(this.tasksLocalService._tasks());
    });
    effect(() => {
      this.handleError(this.tasksResource.error());
    });
  }

  syncLocalTasksToSupabase() {
    const localTasks = this.tasksLocalService._tasks();
    if (localTasks.length === 0) {
      return EMPTY;
    }

    const tasksToInsert: TaskInsert[] = localTasks.map((task) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = task;
      return rest;
    });

    return this.insert(tasksToInsert).pipe(
      tap({
        next: (res) => {
          if (res.data) {
            this.tasksLocalService._tasks.set([]);
            this._tasks.update((currentTasks) => [...res.data, ...currentTasks]);
            this.tasksLocalService._preference.set(true);
            this.toaster.setToast({
              message: `${res.data.length} tasks synced successfully!`,
              type: 'success',
            });
          }
          if (res.error) {
            this.handleError(res.error);
          }
        },
        error: (error) => {
          this.handleError(error);
        },
      }),
    );
  }

  private _searchQuery = signal<string>('');
  private _filterPriority = signal<Priority[]>([]);
  private _filterStatus = signal<Status[]>([]);

  public filteredTasks = computed(() => {
    const allTasks = this._tasks();
    const query = this._searchQuery().toLowerCase();
    const priorities = this._filterPriority();
    const statuses = this._filterStatus();

    return allTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.url && task.url.toLowerCase().includes(query));
      const matchesPriority =
        priorities.length === 0 ||
        (task.priority && priorities.includes(task.priority as Priority));

      const matchesStatus =
        statuses.length === 0 || statuses.some((status) => matchStatus(status, task));
      return matchesSearch && matchesPriority && matchesStatus;
    });
  });

  addTask(task: TaskInsert) {
    if (!this._session()) return this.tasksLocalService.addTask(task);
    else {
      return this.insert(task).pipe(
        tap((res) => {
          if (res.data) {
            this._tasks.update((tasks) => [...res.data, ...tasks]);
          }
          this.toaster.setToast({
            message: 'Task added successfully',
            type: 'success',
          });
        }),
      );
    }
  }

  updateTask(updatedTask: TaskUpdate) {
    if (!this._session()) return this.tasksLocalService.updateTask(updatedTask);
    else {
      return this.update(updatedTask.id!, updatedTask).pipe(
        tap((res) => {
          if (res.data) {
            this._tasks.update((tasks) =>
              tasks.map((task) => (task.id === updatedTask.id ? res.data![0] : task)),
            );
          }
          this.toaster.setToast({
            message: 'Task updated successfully',
            type: 'info',
          });
        }),
      );
    }
  }

  deleteTask(id: number) {
    if (!this._session()) return this.tasksLocalService.deleteTask(id);
    else {
      return this.delete(id).subscribe({
        next: () => {
          this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
          this.toaster.setToast({
            message: 'Task deleted successfully',
            type: 'info',
          });
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.toaster.setToast({
            message: 'Failed to delete error',
            type: 'error',
          });
        },
      });
    }
  }

  setSearchQuery(query: string) {
    this._searchQuery.set(query);
  }

  setPriorityFilters(priorities: Priority[]) {
    this._filterPriority.set(priorities);
  }

  setStatusFilters(statuses: Status[]) {
    this._filterStatus.set(statuses);
  }
}
