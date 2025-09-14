import { Component } from '@angular/core';

@Component({
  selector: 'app-new-badge',
  standalone: true,
  template: ` NEW `,
  host: {
    class:
      'absolute -top-2 -left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-md',
  },
})
export class NewBadge {}
