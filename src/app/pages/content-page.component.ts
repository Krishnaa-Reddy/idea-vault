import { Component } from '@angular/core';

@Component({
  selector: 'content-page',
  standalone: true,
  template: `
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">Content Page</h1>
      <p>This is a sample content page.</p>
    </div>
  `,
  styles: [],
})
export class ContentPageComponent {}
