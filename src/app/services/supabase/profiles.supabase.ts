import { from, shareReplay } from 'rxjs';
import { Tables } from '../../../database.types';
import { _supabase } from './supabase-client';

const PROFILES = 'profiles';

export class ProfilesSupabase {
  protected select(userid: string) {
    return from(
      _supabase
        .from(PROFILES)
        .select()
        .eq('id', userid)
        .single()
        .overrideTypes<Tables<'profiles'>>(),
    ).pipe(shareReplay(1));
  }

  protected update(value: boolean, userid: string) {
    return from(
      _supabase
        .from(PROFILES)
        .update({ enable_reminders: value })
        .eq('id', userid)
        .select()
        .single()
        .overrideTypes<Tables<'profiles'>>(),
    );
  }
}
