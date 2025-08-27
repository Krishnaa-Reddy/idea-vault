import {
  AfterViewInit,
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { NewBadge } from '../shared/new-badge';

@Directive({
  selector: '[highlightBadge]',
})
export class HighlightBadge implements AfterViewInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private vcr = inject(ViewContainerRef);

  highlightBadge = input(true);

  private badgeRef?: ComponentRef<NewBadge>;

  ngAfterViewInit(): void {

    if(this.highlightBadge()) {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
      this.badgeRef = this.vcr.createComponent(NewBadge);
  
      this.renderer.appendChild(
        this.el.nativeElement,
        this.badgeRef.location.nativeElement
      );
  
      this.badgeRef.changeDetectorRef.detectChanges();
    } else {
      this.vcr.clear();
    }


  }
}