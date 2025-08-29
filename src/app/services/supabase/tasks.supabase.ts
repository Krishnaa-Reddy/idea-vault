import { from, share, throwError, timer, mergeMap } from 'rxjs';
import { _supabase } from './supabase-client';
import { Task, TaskInsert, TaskUpdate } from '../../core/models/task.interface';

const TASKS = 'tasks';

export class TasksSupabase {
  protected select() {
    // INFO: To mock server error
    // return timer(500).pipe(
    //   mergeMap(() => throwError(() => new Error('Failed to load tasks from Supabase.'))),
    //   share()
    // );

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
