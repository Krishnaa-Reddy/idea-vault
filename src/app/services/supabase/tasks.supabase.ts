import { from, share } from 'rxjs';
import { _supabase } from './supabase-client';
import { Tables, TablesInsert, TablesUpdate } from '../../../database.types';

type TASKS_TABLE = 'tasks';
const TASKS = 'tasks';

export type Task = Tables<TASKS_TABLE>;
export type TaskInsert = TablesInsert<TASKS_TABLE>;
export type TaskUpdate = TablesUpdate<TASKS_TABLE>;

export class TasksSupabase {
  protected select() {
    return from(_supabase.from(TASKS).select().order('createdAt', { ascending: false }).overrideTypes<Task[]>()).pipe(
      share()
    );
  }

  protected insert(data: TaskInsert) {
    return from(_supabase.from(TASKS).insert(data).select().overrideTypes<Task[]>());
  }

  protected delete(id: number) {
    return from(_supabase.from(TASKS).delete().eq('id', id).select().overrideTypes<Task[]>());
  }


  protected update(id: number, data: TaskUpdate) {
    return from(_supabase.from(TASKS).update(data).eq('id', id).select().overrideTypes<Task[]>());
  }
}
