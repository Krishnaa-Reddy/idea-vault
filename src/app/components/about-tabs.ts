import { Component } from '@angular/core';
import { HlmTabs, HlmTabsContent, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';

@Component({
  selector: 'iv-about-tabs',
  imports: [HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent],
  host: {
    class: 'block w-full flex justify-center',
  },
  template: `
    <hlm-tabs tab="features" class="w-full">
      <hlm-tabs-list aria-label="tabs example" class="w-full">
        <button hlmTabsTrigger="features">Features</button>
        <button hlmTabsTrigger="architecture">Architecture</button>
      </hlm-tabs-list>
      <div hlmTabsContent="features">
        <ng-content select="features" />
      </div>
      <div hlmTabsContent="architecture">
        <ng-content select="architecture" />
      </div>
    </hlm-tabs>
  `,
})
export class AboutTabs {}
