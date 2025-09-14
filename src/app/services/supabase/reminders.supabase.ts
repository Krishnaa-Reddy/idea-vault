import { from, shareReplay } from 'rxjs';
import { Tables } from '../../../database.types';
import { _supabase } from './supabase-client';

const REMINDERS = 'reminders';

export class RemindersSupabase {
  protected select(userid: string) {
    return from(
      _supabase
        .from(REMINDERS)
        .select()
        .eq('user_id', userid)
        .single()
        .overrideTypes<Tables<'reminders'>>(),
    ).pipe(shareReplay(1));
  }

  protected update(value: boolean, userid: string) {
    return from(
      _supabase
        .from('reminders')
        .update({ enable_reminder: value })
        .eq('user_id', userid)
        .select()
        .single()
        .overrideTypes<Tables<'reminders'>>(),
    );
  }
}
