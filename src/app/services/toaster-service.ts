import { Injectable, signal } from '@angular/core';
import { ToastT, toast } from 'ngx-sonner';

export type Toast = ToastT & { message: string };

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toast = signal<Toast | undefined>(undefined);

  _toast = this.toast.asReadonly();

  setToast(toast: Omit<Toast, 'id'>) {
    this.toast.set({
      ...toast,
      id: new Date().getTime(),
    });
  };
}
