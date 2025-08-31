import { computed, effect, inject, Injectable, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Priority, Task, TaskInsert, TaskUpdate } from '../core/models/task.interface';
import {
  titleValidator,
  urlValidator,
  urlForbiddenValidator,
} from '../validators/url-validator.validator';
import { toSignal } from '@angular/core/rxjs-interop';
import { isFullUrl, dateToISO, ISOtoDate } from '../utils';
import { map, of } from 'rxjs';
import { StatusFields } from '../components/shared/status-fiels-section';

@Injectable({
  providedIn: 'root',
})
export class TaskFormService implements OnDestroy {
  readonly taskGroup = inject(NonNullableFormBuilder).group({
    title: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(120), titleValidator()],
    ],
    url: [null as string | null, urlValidator()],
    description: [null as string | null, urlForbiddenValidator()],
    priority: 'Low' as Priority,
    reminderTime: new Date() as Date | null,
    archived: false,
    completed: false,
  });

  _invalidTaskForm = toSignal(this.taskGroup.valueChanges.pipe(map((_) => this.taskGroup.invalid)));
  _title = toSignal(this.taskGroup.get('title')?.valueChanges ?? of(null));

  titleError = computed(() => {
    const titleErrors = this.taskGroup.get('title')?.errors;
    if (this._title() && titleErrors) {
      if (titleErrors['titleMixedUrl']) {
        return 'Title cannot contain both URL and text';
      }
      if (titleErrors['required']) {
        return 'Title is required';
      }
    }
    return undefined;
  });

  urlUpdateWithTitleChangeEffect = effect(() => {
    const title = this._title();
    if (title && isFullUrl(title)) {
      this.taskGroup.get('url')?.setValue(title.trim());
    }
  });

  // If we have a task, we can set the defaults
  constructTaskGroupFromTask(task: Task) {
    this.taskGroup.setValue({
      title: task.title,
      url: task.url,
      description: task.description,
      priority: task.priority as Priority,
      reminderTime: ISOtoDate(task.reminderTime),
      completed: task.completed,
      archived: task.archived,
    });
  }

  constructTaskInsert() {
    const formData = this.taskGroup.getRawValue();
    return{
      ...formData,
      reminderTime: dateToISO(formData.reminderTime),
    };
  }

  constructTaskUpdateFromTaskId(id: number): TaskUpdate {
    const formData = this.taskGroup.getRawValue();
    return {
      ...formData,
      id,
      reminderTime: dateToISO(formData.reminderTime),
    };
  }

  patchStatusValuesToTaskGroup(task: StatusFields) {
    this.taskGroup.patchValue({
      completed: task.completed,
      archived: task.archived,
    });
  }

  ngOnDestroy(): void {
    this.urlUpdateWithTitleChangeEffect.destroy();
  }
}
