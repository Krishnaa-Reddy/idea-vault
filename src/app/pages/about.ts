import { Component } from '@angular/core';
import { AboutTabs } from '../components/about-tabs';
import { MdRender } from '../components/md-render';

@Component({
  selector: 'iv-about',
  imports: [MdRender, AboutTabs],
  template: `
    <iv-about-tabs>
      <iv-md-render src="docs/FEATURES.md" ngProjectAs="features"></iv-md-render>
      <iv-md-render src="docs/ARCHITECTURE.md" ngProjectAs="architecture"></iv-md-render>
    </iv-about-tabs>
  `,
})
export class AboutPage {}
