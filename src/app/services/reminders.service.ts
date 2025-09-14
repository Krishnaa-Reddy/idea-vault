import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY, map } from 'rxjs';
import { RemindersSupabase } from './supabase/reminders.supabase';
import { UserService } from './users';

@Injectable({
  providedIn: 'root',
})
export class RemindersService extends RemindersSupabase {
  private session = inject(UserService)._session;
  userid = computed(() => this.session()?.user.id);

  reminderResource = rxResource({
    params: () => this.userid(),
    stream: (params) => {
      if (!params.params) return EMPTY;
      return this.select(params.params).pipe(
        map((res) => {
          if (res && res.data) {
            return 'enable_reminder' in res.data ? res.data.enable_reminder : false;
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
    return this.select(userid);
  }

  updateTaskReminders(status: boolean) {
    const userid = this.userid();
    if (!userid) return EMPTY;
    return this.update(status, userid);
  }
}
