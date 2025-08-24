import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  HlmAlertDialog,
  HlmAlertDialogActionButton,
  HlmAlertDialogCancelButton,
  HlmAlertDialogContent,
  HlmAlertDialogDescription,
  HlmAlertDialogFooter,
  HlmAlertDialogHeader,
  HlmAlertDialogTitle,
} from '@spartan-ng/helm/alert-dialog';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { Task } from '../../core/models/task.interface';


// TODO: Revisit this entire component. This maybe usefula and may not be

@Component({
  selector: 'app-reschedule-reminder-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmAlertDialog,
    HlmAlertDialogActionButton,
    HlmAlertDialogCancelButton,
    HlmAlertDialogContent,
    HlmAlertDialogDescription,
    HlmAlertDialogFooter,
    HlmAlertDialogHeader,
    HlmAlertDialogTitle,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    HlmButton,
    HlmDatePicker,
    HlmInput,
    HlmLabel,
  ],
  template: `
    <hlm-alert-dialog class="animate-fade-in-up">
      <button brnAlertDialogTrigger hlmBtn variant="outline" class="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">Edit Reminder</button>
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx" class="sm:max-w-[425px]">
        <hlm-alert-dialog-header class="text-center">
          <h2 hlmAlertDialogTitle class="text-2xl font-bold">Reschedule Reminder</h2>
          <p hlmAlertDialogDescription class="text-muted-foreground">Set a new date and time for your reminder.</p>
        </hlm-alert-dialog-header>
        <div class="p-6 flex flex-col gap-5">
          <div class="flex flex-col space-y-2">
            <label hlmLabel class="text-sm font-medium">Date</label>
            <hlm-date-picker [formControl]="newReminderDateControl" class="w-full p-2 rounded-md border-input" />
          </div>
          <div class="flex flex-col space-y-2">
            <label hlmLabel class="text-sm font-medium">Time</label>
            <input hlmInput type="time" [formControl]="newReminderTimeControl" class="w-full p-2 rounded-md border-input" />
          </div>
        </div>
        <hlm-alert-dialog-footer class="flex-col sm:flex-row sm:justify-end gap-2 p-4">
          <button hlmAlertDialogCancel (click)="ctx.close()" class="w-full sm:w-auto h-9 px-4 py-2">Cancel</button>
          <button hlmAlertDialogAction (click)="saveReminder(ctx)" [disabled]="newReminderDateControl.invalid || newReminderTimeControl.invalid" class="w-full sm:w-auto h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Save
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.3s ease-out forwards;
    }
  `]
})
export class RescheduleReminderDialogComponent {
  task = input.required<Task>();
  reschedule = output<Date>();

  newReminderDateControl = new FormControl<Date | null>(null, Validators.required);
  newReminderTimeControl = new FormControl<string | null>(null, Validators.required);

  constructor() {
    const initialDate = this.task().reminderTime ? new Date(this.task().reminderTime!) : new Date();
    this.newReminderDateControl.setValue(initialDate);
    const initialTime = this.task().reminderTime ? this.formatTime(this.task().reminderTime!) : '09:00';
    this.newReminderTimeControl.setValue(initialTime);
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  saveReminder(ctx: { close: () => void }) {
    if (this.newReminderDateControl.valid && this.newReminderTimeControl.valid) {
      const newDate = this.newReminderDateControl.value!;
      const newTime = this.newReminderTimeControl.value!;

      const [hours, minutes] = newTime.split(':').map(Number);
      const finalReminderTime = new Date(newDate);
      finalReminderTime.setHours(hours, minutes, 0, 0);

      this.reschedule.emit(finalReminderTime);
      ctx.close();
    }
  }
}
