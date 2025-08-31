import { Component, Input, signal } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
  selector: 'iv-text-area',
  standalone: true,
  imports: [HlmInput],
  template: `
    <textarea
      hlmInput
      class="min-h-[80px] w-full"
      [placeholder]="placeholder"
      [rows]="rows"
      [disabled]="disabled"
      [value]="value()"
      (input)="onInput($event)"
      aria-label="Text area"
    ></textarea>
  `,
})

// TODO: This has some issue when used inside a form or inside an accordion
// TODO: Why is this weird behavior? No spaces coming in
export class IvTextArea {

    // TODO: Replace below ones with new signals approach
  @Input() placeholder: string = 'Type your message here.';
  @Input() rows: number = 4;
  @Input() disabled: boolean = false;
  @Input() set model(value: string) {
    this.value.set(value ?? '');
  }
  value = signal<string>('');

  onInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.value.set(input.value);
  }
}
