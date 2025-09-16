import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY, map, tap } from 'rxjs';
import { ProfilesSupabase } from './supabase/profiles.supabase';
import { ToasterService } from './toaster-service';
import { UserService } from './users';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService extends ProfilesSupabase {
  private session = inject(UserService)._session;
  private toaster = inject(ToasterService);
  userid = computed(() => this.session()?.user.id);

  reminderResource = rxResource({
    params: () => this.userid(),
    stream: (params) => {
      if (!params.params) return EMPTY;
      return this.select(params.params).pipe(
        tap(res => {
          if(res?.error) this.toaster.setToast({
            message: 'Failed to fetch reminder status',
            description: res.error.message,
            type: 'error',
            position: 'top-right',
          });
        }),
        map((res) => {
          if (res && res.data) {
            return 'enable_reminders' in res.data ? res.data.enable_reminders : false;
          }
          return false;
        }),
      );
    },
    defaultValue: false,
  });

  getReminderStatus() {
    const userid = this.userid();
    if (!userid) return EMPTY;
    return this.select(userid).pipe(
      tap(res => {
        if(res?.error) throw new Error(res.error.message);
      }),
    );
  }

  updateTaskReminders(status: boolean) {
    const userid = this.userid();
    if (!userid) return EMPTY;
    return this.update(status, userid).pipe(
      tap(res => {
        if(res?.error) throw new Error(res.error.message);
      }),
    );
  }
}
