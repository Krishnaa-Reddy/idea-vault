import { Component, inject, effect, untracked } from '@angular/core';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { toast as showToast, ToastProps } from 'ngx-sonner';
import { ToasterService } from '../services/toaster-service';

@Component({
  selector: 'show-sonner',
  imports: [HlmToaster],
  template: ` <hlm-toaster /> `,
})
export class ShowToaster {
  private toaster = inject(ToasterService);

  _toast = this.toaster._toast;

  constructor(){
    effect(()=> {
           const toast = this._toast();
    if (toast) {
      const { message, ...rest } = toast;

      untracked(() => {
        showToast(message, rest);
      });
    }
    });
  }
}
