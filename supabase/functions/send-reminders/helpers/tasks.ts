import { createClient } from 'npm:@supabase/supabase-js';
import { Task } from '../types/interfaces.ts';

// Helper to fetch overdue tasks
export async function fetchOverdueTasks(supabaseClient: ReturnType<typeof createClient>): Promise<Task[] | null> {
  const { data: tasks, error } = await supabaseClient
    .from('tasks')
    .select('*')
    .eq('is_reminder_sent', false)
    .eq('completed', false)
    .lt('reminderTime', new Date().toISOString());

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message);
  }
  return tasks as Task[];
}
