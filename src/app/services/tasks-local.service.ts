import { effect, inject, Injectable, signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { Task, TaskInsert, TaskUpdate } from '../core/models/task.interface';
import { getFromLocalStorage, saveToLocalStorage } from '../utils';
import { ToasterService } from './toaster-service';

@Injectable({
  providedIn: 'root',
})
export class TasksLocalService {
  private _toaster = inject(ToasterService);
  private readonly STORAGE_KEY = 'tasks';
  private readonly PREFERENCE_KEY = 'PREFER_TASKS_LOCALLY';

  public _tasks = signal<Task[]>(getFromLocalStorage(this.STORAGE_KEY, []));
  public _preference = signal<boolean>(getFromLocalStorage(this.PREFERENCE_KEY, true));

  constructor() {
    effect(() => {
      saveToLocalStorage(this.PREFERENCE_KEY, this._preference());
    });

    effect(() => {
      saveToLocalStorage(this.STORAGE_KEY, this._tasks());
    });
  }

  handleError(error?: Error | null) {
    if (error) {
      this._toaster.setToast({
        message: error.message,
        dismissible: true,
        closeButton: true,
        type: 'warning',
      });
    }
  }

  addTask(task: TaskInsert) {
    const newTask: Task = {
      ...task,
      user_id: null,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      completed: task.completed || false,
      archived: task.archived || false,
      is_reminder_sent: false,
      url: null,
      description: task.description || null,
      reminderTime: task.reminderTime || null,
    };

    this._tasks.update((tasks) => [newTask, ...tasks]);
    this._toaster.setToast({
      message: 'Task added successfully',
      type: 'success',
    });
    return EMPTY;
  }

  updateTask(updatedTask: TaskUpdate) {
    this._tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === updatedTask.id) {
          return { ...task, ...updatedTask } as Task;
        }
        return task;
      }),
    );
    this._toaster.setToast({
      message: 'Task updated successfully',
      type: 'info',
    });
    return EMPTY;
  }

  deleteTask(id: number) {
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
    this._toaster.setToast({
      message: 'Task deleted successfully',
      type: 'info',
    });

    return EMPTY;
  }
}
