import { Component, computed, effect, inject, input, linkedSignal, model, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucidePencil } from '@ng-icons/lucide';
import { BrnDialogContent, BrnDialogTrigger } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import {
	HlmDialog,
	HlmDialogContent,
	HlmDialogDescription,
	HlmDialogFooter,
	HlmDialogHeader,
	HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'edit-task-dialog',
	imports: [
		BrnDialogTrigger,
		ReactiveFormsModule,
		BrnDialogContent,
		HlmDialog,
		HlmDialogContent,
		HlmDialogHeader,
		HlmDialogFooter,
		HlmDialogTitle,
		HlmDialogDescription,
		HlmLabel,
		HlmInput,
		HlmButton,
		NgIcon,
		HlmIcon
	],
	providers: [provideIcons({ lucideCheck, lucideChevronDown, lucidePencil })],
	template: `
		<hlm-dialog>
			<button id="edit-profile" brnDialogTrigger hlmBtn size="icon" variant="secondary" class="size-8">
			    <ng-icon hlm size="sm" name="lucidePencil" />
		</button>
			<hlm-dialog-content class="sm:max-w-[425px]" *brnDialogContent="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Edit task</h3>
					<p hlmDialogDescription>Make changes to your task here. Click save when you're done.</p>
				</hlm-dialog-header>
				<div class="grid gap-4 py-4">
				<div class="grid gap-2 flex-1">
                <label hlmLabel for="priority">Task</label>
				<input type="text" id="task" hlmInput placeholder="Add a new task or paste a URL" />
              </div>
				</div>
				<hlm-dialog-footer>
					<button hlmBtn type="submit" (click)="editTask()">{{editTask()}}</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class EditDialog {

	// TODO: I need to know a better to do this.
	// Why to. initialize taskDescControl empyty
	// and then again, using an extar construcot adn effect to initialize it?
	// can we use linkedSignal here?
	// or any btter solution?


	// Why do I fail to achieve rhis edit feature. why do i get this new error?

	private _tasks = inject(TaskService);
	task = input.required<Task>();
	// taskDescControl = new FormControl('', Validators.required);
	editText = signal('Save changes');
	taskDesc = linkedSignal(() => this.task().description);

	// constructor() {
	// 	effect(() => {
	// 		this.taskDescControl.setValue(this.task().description);
	// 	})
	// }

	editTask() {
		this.editText.set('Saving...');
		setTimeout(() => {
			// this._tasks.updateTask({...this.task(), description: this.taskDescControl.value!});
			this.editText.set('Save changes');
		}, 1000);
		
	}
}