import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePencil, lucidePlus } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import {
  HlmAccordion,
  HlmAccordionContent,
  HlmAccordionIcon,
  HlmAccordionItem,
  HlmAccordionTrigger,
} from '@spartan-ng/helm/accordion';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { TaskInsert } from '../../core/models/task.interface';
import { TaskFormService } from '../../services/task-form';

/**
 * Your default reminder time is 24 hours from now.
 * Tomorrow
 */
export const DEFAULT_REMINDER_AT = 24 * 60 * 60 * 1000;

export interface TaskFormEvent {
  isValid: boolean;
  data: TaskInsert;
}

@Component({
  selector: 'task-form',
  imports: [
    HlmDatePicker,
    ReactiveFormsModule,
    BrnSelectImports,
    HlmSelectImports,
    HlmFormFieldModule,
    HlmAccordion,
    HlmAccordionItem,
    HlmAccordionTrigger,
    HlmAccordionIcon,
    HlmAccordionContent,
    HlmLabel,
    HlmInput,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucideCheck, lucidePlus, lucidePencil })],
  template: `
    <form class="flex flex-col gap-6 w-xs sm:w-md" [formGroup]="taskGroup">
      <hlm-form-field>
        <input
          hlmInput
          required
          type="text"
          id="title"
          formControlName="title"
          placeholder="Add a new task or paste a URL"
        />
        <hlm-error>{{ titleError() }}</hlm-error>
      </hlm-form-field>
      <div hlmAccordion class="w-full">
        <ng-content select="status-fields-section" />
        <div hlmAccordionItem>
          <button hlmAccordionTrigger>
            <h4 class="font-semibold">Additional Options</h4>
            <ng-icon name="lucideChevronDown" hlm hlmAccIcon />
          </button>
          <hlm-accordion-content>
            <hlm-form-field class="p-1">
              <input
                hlmInput
                type="text"
                id="url"
                formControlName="url"
                placeholder="Add an URL (Optional)"
              />
              <hlm-error>Invalid URL.</hlm-error>
            </hlm-form-field>

            <hlm-form-field class="p-1">
              <input
                hlmInput
                type="text"
                id="description"
                formControlName="description"
                placeholder="Add a description (Optional)"
              />
              <hlm-error>No URLs allowed.</hlm-error>
            </hlm-form-field>

            <div class="flex gap-4">
              <div class="grid gap-2 flex-1">
                <label hlmLabel for="priority">Priority</label>
                <hlm-form-field>
                  <brn-select
                    formControlName="priority"
                    class="inline-block w-full"
                    placeholder="Select an option"
                  >
                    <hlm-select-trigger class="w-full flex">
                      <hlm-select-value />
                    </hlm-select-trigger>
                    <hlm-select-content>
                      <hlm-option value="High">High</hlm-option>
                      <hlm-option value="Medium">Medium</hlm-option>
                      <hlm-option value="Low">Low</hlm-option>
                    </hlm-select-content>
                  </brn-select>
                  <hlm-error>The priority is required</hlm-error>
                </hlm-form-field>
              </div>
              <div class="grid gap-2 flex-1">
                <label hlmLabel for="reminder">Reminder Date</label>
                <div class="flex gap-2">
                  <hlm-date-picker
                    [min]="minDate"
                    autoCloseOnSelect
                    formControlName="reminderTime"
                    class="w-full"
                  >
                    <span>Select date</span>
                  </hlm-date-picker>
                </div>
              </div>
            </div>
          </hlm-accordion-content>
        </div>
      </div>
    </form>
  `,
})
export class TaskForm {
  minDate = new Date();
  private taskForm = inject(TaskFormService);

  taskGroup = this.taskForm.taskGroup;
  titleError = this.taskForm.titleError;
}
