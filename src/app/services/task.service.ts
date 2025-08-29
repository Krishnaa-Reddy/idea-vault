import { computed, effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Priority, Status, Task, TaskInsert, TaskUpdate } from '../core/models/task.interface';
import { TasksSupabase } from './supabase/tasks.supabase';
import { ToasterService } from './toaster-service';

const testTasks: Task[] = [
  {
    id: 1,
    description:
      'Buy groceries; Buy groceries;  Buy groceries; Buy groceries;  Buy groceries;  Buy groceries; ',
    completed: false,
    archived: false,
    createdAt: new Date().toISOString(),
    priority: 'High',
    reminderTime: null,
    url: null,
  },
  {
    id: 2,
    description: 'Finish project report',
    completed: false,
    archived: false,
    createdAt: new Date().toISOString(),
    priority: 'Medium',
    reminderTime: null,
    url: null,
  },
  {
    id: 3,
    description: 'Call mom',
    completed: true,
    archived: false,
    createdAt: new Date().toISOString(),
    priority: 'Low',
    reminderTime: null,
    url: null,
  },
  {
    id: 4,
    description: 'Go to the gym',
    completed: false,
    archived: true,
    createdAt: new Date().toISOString(),
    priority: 'High',
    reminderTime: null,
    url: null,
  },
];

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
    completed: (t) => t.completed,
    archived: (t) => t.archived,
    pending: (t) => !isToday(t.createdAt) && !t.completed && !t.archived,
  };

  return statusChecks[status](task);
};

@Injectable({ providedIn: 'root' })
export class TaskService extends TasksSupabase {
  private toaster = inject(ToasterService);

  // NOTE: We can set/update tasks/resource as well with this.
  // we can use this to replace - somehow below tasks phase.

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

  /// NOTE: The biggest problem with rxResource is
  // They now throw an error if no resource and we try to access value.
  // That's where the root cause; this was not the behavior in v19
  // New work around: have to check hasValue() before we access it.
  private tasksResource = rxResource<Task[], undefined>({
    stream: () =>
      this.select().pipe(
        tap((res) => this.handleError(res?.error)),
        map((res) => res?.data ?? [])

        // With the new change in rxResource. I think this is the advantage.
        // I dont explcitly have to catch the error. value() throws it.
        // NOTE: Only thing I have to remember is to check hasValue; "everytime" before accessing it!!

        // catchError((err: Error) => {
        //   throw err;
        // })
      ),
  }).asReadonly();

  // What's happening here?
  // I am throwing the error in the resource. It has been thrown by .value()
  public _tasks = linkedSignal<Task[]>(() => {
    if (this.tasksResource.hasValue()) return this.tasksResource.value();
    return [];
  });

  tasksLoading = this.tasksResource.isLoading;
  tasksError = this.tasksResource.error;

  constructor() {
    super();
    effect(() => {
      this.handleError(this.tasksResource.error());
    });
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
        task.description.toLowerCase().includes(query) ||
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
    return this.insert(task).pipe(
      tap((res) => {
        if (res.data) {
          this._tasks.update((tasks) => [...res.data, ...tasks]);
        }
        this.toaster.setToast({
          message: 'Task added successfully',
          type: 'success',
        });
      })
    );
  }

  updateTask(updatedTask: TaskUpdate) {
    return this.update(updatedTask.id!, updatedTask).pipe(
      tap((res) => {
        if (res.data) {
          this._tasks.update((tasks) =>
            tasks.map((task) => (task.id === updatedTask.id ? res.data![0] : task))
          );
        }
        this.toaster.setToast({
          message: 'Task updated successfully',
          type: 'info',
        });
      })
    );
  }

  deleteTask(id: number) {
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
