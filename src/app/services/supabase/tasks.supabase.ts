import { from, shareReplay } from 'rxjs';
import { Task, TaskInsert, TaskUpdate } from '../../core/models/task.interface';
import { _supabase } from './supabase-client';

const TASKS = 'tasks';

export class TasksSupabase {
  protected select() {
    return from(
      _supabase
        .from(TASKS)
        .select()
        .order('createdAt', { ascending: false })
        .overrideTypes<Task[]>(),
    ).pipe(shareReplay(1));
  }

  protected insert(data: TaskInsert | TaskInsert[]) {
    return from(_supabase.from(TASKS).insert(data).select().overrideTypes<Task[]>());
  }

  protected delete(id: number) {
    return from(_supabase.from(TASKS).delete().eq('id', id).select().overrideTypes<Task[]>());
  }

  protected update(id: number, data: TaskUpdate) {
    return from(_supabase.from(TASKS).update(data).eq('id', id).select().overrideTypes<Task[]>());
  }
}
