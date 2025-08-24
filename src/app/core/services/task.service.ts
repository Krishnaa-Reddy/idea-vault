import { Injectable, signal, computed } from '@angular/core';
import { Task, Priority } from '../models/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _tasks = signal<Task[]>([
    {
      id: '1',
      description: 'Plan weekly team meeting',
      priority: 'High',
      reminderTime: new Date(2024, 8, 15, 10, 0),
      completed: false,
      archived: false,
  },
    {
      id: '2',
      description: 'Review project documentation',
      url: 'https://example.com/docs',
      priority: 'Medium',
      reminderTime: new Date(2024, 8, 16, 14, 30),
      completed: false,
      archived: false,
    },
    {
      id: '3',
      description: 'Send out meeting minutes',
      priority: 'Low',
      completed: true,
      archived: true,
    },
    {
      id: '4',
      description: 'Follow up with client A',
      priority: 'High',
      reminderTime: new Date(2024, 8, 17, 9, 0),
      completed: false,
      archived: true,
    },
    {
      id: '5',
      description: 'Brainstorm new feature ideas',
      priority: 'Medium',
      completed: false,
      archived: false,
    },
  ]);
  private tasks = this._tasks.asReadonly();

  private _searchQuery = signal<string>('');
  private _filterPriority = signal<Priority[]>([]);

  public filteredTasks = computed(() => {
    const allTasks = this._tasks();
    const query = this._searchQuery().toLowerCase();
    const priorities = this._filterPriority();

    return allTasks.filter((task) => {
      const matchesSearch = task.description.toLowerCase().includes(query) || (task.url && task.url.toLowerCase().includes(query));
      const matchesPriority = priorities.length === 0 || priorities.includes(task.priority);
      return matchesSearch && matchesPriority;
    });
  });

  addTask(task: Task) {
    const newTask = { ...task, id: Date.now().toString() };
    this._tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(updatedTask: Task) {
    this._tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  deleteTask(id: string) {
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  markTaskAsComplete(id: string) {
    this._tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  archiveTask(id: string) {
    this._tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, archived: !task.archived } : task)),
    );
  }

  rescheduleReminder(updatedTask: Task) {
    this._tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  setSearchQuery(query: string) {
    this._searchQuery.set(query);
  }

  setFilterPriorities(priorities: Priority[]) {
    this._filterPriority.set(priorities);
  }
}
