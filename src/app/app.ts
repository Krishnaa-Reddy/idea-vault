import { Component, signal } from '@angular/core';
import { DialogExample } from './components/dialog/dialog';

@Component({
  selector: 'app-root',
  imports: [DialogExample],
  template: `
    <div class="flex h-screen items-center justify-center">
      <dialog-example />
    </div>
  `,
})
export class App {
  protected readonly title = signal('idea-vault');
}
