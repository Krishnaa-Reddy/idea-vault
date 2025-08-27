import {
  Injectable,
  signal,
  computed,
  inject,
  Signal,
  linkedSignal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Task, TaskInsert, TasksSupabase, TaskUpdate } from './supabase/tasks.supabase';
import { tap } from 'rxjs';
import { Status, Priority } from '../core/models/task.interface';
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

  private _tasksResponse = toSignal(this.select());
  private _tasks: WritableSignal<Task[]> = linkedSignal(
    () => this._tasksResponse()?.data || []
    // () => testTasks
  );

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
          type: 'success'
        });

      })
    );
  }

  updateTask(updatedTask: TaskUpdate) {
    return this.update(updatedTask.id!, updatedTask).pipe(
      tap(res => {
        if (res.data) {
          this._tasks.update((tasks) =>
            tasks.map((task) => (task.id === updatedTask.id ? res.data![0] : task))
          );
        }
        this.toaster.setToast({
          message: 'Task updated successfully',
          type: 'info'
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
          type: 'info'
        });
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.toaster.setToast({
          message: 'Failed to delete error',
          type: 'error'
        });
      },
    });
  }

  markTaskAsComplete(id: number) {
    const currentTask = this._tasks().find((task) => task.id === id);
    if (currentTask) {
      const updatedTask = { ...currentTask, completed: !currentTask.completed };
      this.update(id, { completed: updatedTask.completed }).subscribe({
        next: (response) => {
          if (response.data) {
            this._tasks.update((tasks) =>
              tasks.map((task) => (task.id === id ? response.data![0] : task))
            );
          }
        },
        error: (error) => {
          console.error('Error marking task as complete:', error);
        },
      });
    }
  }

  archiveTask(id: number) {
    const currentTask = this._tasks().find((task) => task.id === id);
    if (currentTask) {
      const updatedTask = { ...currentTask, archived: !currentTask.archived };
      this.update(id, { archived: updatedTask.archived }).subscribe({
        next: (response) => {
          if (response.data) {
            this._tasks.update((tasks) =>
              tasks.map((task) => (task.id === id ? response.data![0] : task))
            );
          }
        },
        error: (error) => {
          console.error('Error archiving task:', error);
        },
      });
    }
  }

  rescheduleReminder(updatedTask: Task) {
    this.update(updatedTask.id!, updatedTask).subscribe({
      next: (response) => {
        if (response.data) {
          this._tasks.update((tasks) =>
            tasks.map((task) => (task.id === updatedTask.id ? response.data![0] : task))
          );
        }
      },
      error: (error) => {
        console.error('Error rescheduling reminder:', error);
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
