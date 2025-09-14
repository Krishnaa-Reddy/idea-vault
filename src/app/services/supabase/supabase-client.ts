import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from '../../../database.types';
import { environment } from '../../../environments/environment';

const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseKey;
export const SUPABASE_SESSION_KEY = 'supabase-session';

export const _supabase: SupabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    storageKey: SUPABASE_SESSION_KEY,
  },
});
