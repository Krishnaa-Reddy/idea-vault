import { Component, input } from '@angular/core';
import { BrnTooltipContentTemplate } from '@spartan-ng/brain/tooltip';
import { HlmTooltip, HlmTooltipTrigger } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'iv-tooltip',
  imports: [HlmTooltip, BrnTooltipContentTemplate, HlmTooltipTrigger],
  template: `
    <hlm-tooltip>
      <div hlmTooltipTrigger class="flex" [showDelay]="lazy() ? 1000 : 0">
        <ng-content />
      </div>
      <div *brnTooltipContent class="max-w-xl break-words whitespace-pre-line text-wrap italic">
        {{ value() }}
      </div>
    </hlm-tooltip>
  `,
})
export class IvTooltipComponent {
  value = input.required<string>();
  lazy = input<boolean>(false);
}
