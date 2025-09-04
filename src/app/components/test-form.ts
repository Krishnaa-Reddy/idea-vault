import { AfterViewInit, Component, inject, input, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { Task } from '../core/models/task.interface';
import { TaskFormService } from '../services/task-form';
import { StatusFieldsSection } from './shared/status-fiels-section';
import { TaskForm } from './shared/task-form';

@Component({
  selector: 'add-task-form',
  imports: [TaskForm, HlmButton],
  providers: [TaskFormService],
  template: `
    <div class="w-full border-2 p-4">
      <h2 class="text-2xl font-bold mb-4">Quick Add Task</h2>
      <task-form> </task-form>
      <button type="submit" hlmBtn [disabled]="">
        {{ submitText() }}
      </button>
    </div>
  `,
})
export class AddTaskForm {
  submitText = signal<string>('Submit');
}

@Component({
  selector: 'edit-task-form',
  providers: [TaskFormService],
  imports: [TaskForm, StatusFieldsSection],
  template: `
    <div class="w-full border-2 p-4">
      <h2 class="text-2xl font-bold mb-4">Edit Task</h2>
      <task-form>
        <status-fields-section></status-fields-section>
      </task-form>
    </div>
  `,
})
export class EditTestForm implements AfterViewInit {
  task = input.required<Task>();
  private _taskFormService = inject(TaskFormService);

  ngAfterViewInit(): void {
    this._taskFormService.constructTaskGroupFromTask(this.task());
  }
}

@Component({
  selector: 'app-multiple-forms',
  imports: [AddTaskForm, EditTestForm],
  template: `
    <div class="w-full p-8 m-4 min-h-[80vh] border-2 border-gray-400 flex justify-center gap-8">
      <add-task-form />
      <edit-task-form [task]="sampleTask"></edit-task-form>
    </div>
  `,
})
export class MultipleForms {
  sampleTask: Task = {
    title: 'Sample Task',
    url: 'https://github.com/krishnareddy/idea-vault',
    description: 'This is a sample task',
    priority: 'Low',
    reminderTime: new Date().toISOString(),
    completed: false,
    archived: false,
    user_id: null,
    createdAt: Date.now().toString(),
    id: Date.now().valueOf(),
    is_reminder_sent: null,
  };
}
