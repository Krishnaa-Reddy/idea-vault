import { createClient } from 'npm:@supabase/supabase-js';
import { CategorizedTasks, Task } from '../types/interfaces.ts';

// Helper to fetch overdue tasks
export async function fetchCategorizedTasks(
  supabaseClient: ReturnType<typeof createClient>,
): Promise<CategorizedTasks> {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  // Define approaching window (e.g. 3 days from now)
  const approachingWindow = new Date(now);
  approachingWindow.setDate(approachingWindow.getDate() + 3);

  const { data: tasks, error } = await supabaseClient
    .from('tasks')
    .select('*')
    .eq('isReminderSent', false)
    .eq('completed', false)
    .lte('reminderTime', approachingWindow.toISOString()); // allow overdue + today + upcoming

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message);
  }

  const overdueTasks = tasks.filter(
    task => task.reminderTime && new Date(task.reminderTime) < startOfToday,
  );

  const todayTasks = tasks.filter(
    task =>
      task.reminderTime &&
      new Date(task.reminderTime) >= startOfToday &&
      new Date(task.reminderTime) <= endOfToday,
  );

  const upcomingTasks = tasks.filter(
    task => task.reminderTime && new Date(task.reminderTime) > endOfToday,
  );

  return {
    overdue: overdueTasks,
    today: todayTasks,
    approaching: upcomingTasks,
  };
}

// Helper to update task status
export async function updateTaskStatus(
  supabaseClient: ReturnType<typeof createClient>,
  taskIds: string[],
  emailSent: boolean,
): Promise<void> {
  const updateData: { isReminderSent?: boolean } = {};
  if (emailSent) updateData.isReminderSent = true;

  if (Object.keys(updateData).length > 0) {
    const { error: updateError } = await supabaseClient
      .from('tasks')
      .update(updateData)
      .in('id', taskIds);

    if (updateError) {
      console.error('Error updating task status:', updateError);
    }
  }
}
