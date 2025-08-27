import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { environment } from "../../../environments/environment";
import { Database } from "../../../database.types";

const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseKey;

export const _supabase : SupabaseClient = createClient<Database>(supabaseUrl, supabaseKey);