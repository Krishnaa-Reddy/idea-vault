import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarkdownComponent } from 'ngx-markdown';
import { ThemeService } from '../services/theme/theme.service';

@Component({
  selector: 'iv-md-render',
  imports: [MarkdownComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
  host: { '[class]': 'theme()' },
  styles: [
    `
      :host {
        display: contents;
      }
      div {
        max-width: 100%;
        margin: 0 auto;
        padding: 1.5rem;
        border-radius: 12px;
        font-family:
          system-ui,
          -apple-system,
          'Segoe UI',
          Roboto,
          sans-serif;
        line-height: 1.6;
        transition:
          background 0.3s ease,
          color 0.3s ease;
      }
      /* Light theme */
      :host(.light) div {
        background: #fff;
        color: #1a1a1a;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }
      :host(.light) h1 {
        border-bottom: 2px solid #eee;
      }
      :host(.light) h2 {
        border-bottom: 1px solid #eee;
      }
      :host(.light) code {
        background: #f5f5f5;
        color: #d6336c;
      }
      :host(.light) pre {
        background: #282c34;
        color: #f5f5f5;
      }
      :host(.light) blockquote {
        border-left: 4px solid #ccc;
        color: #555;
      }
      :host(.light) a {
        color: #3b82f6;
      }
      /* Dark theme */
      :host(.dark) div {
        background: #1e1e1e;
        color: #e5e5e5;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      }
      :host(.dark) h1 {
        border-bottom: 2px solid #333;
      }
      :host(.dark) h2 {
        border-bottom: 1px solid #333;
      }
      :host(.dark) code {
        background: #2d2d2d;
        color: #ffcc99;
      }
      :host(.dark) pre {
        background: #0d1117;
        color: #e6edf3;
      }
      :host(.dark) blockquote {
        border-left: 4px solid #444;
        color: #aaa;
      }
      :host(.dark) a {
        color: #60a5fa;
      }
      :host(.dark) a:hover {
        color: #93c5fd;
      }
    `,
  ],
  template: `
    <div>
      <markdown emoji [src]="src()"></markdown>
    </div>
  `,
})
export class MdRender {
  src = input.required<string>();

  private themeService = inject(ThemeService);
  readonly theme = toSignal(this.themeService.theme$, { initialValue: 'light' });
}
