import { SupabaseClient } from 'npm:@supabase/supabase-js';

/**
 * @description Updates the is_reminder_sent status of tasks.
 * @param supabaseClient The Supabase client instance.
 * @param taskIds The IDs of the tasks to update.
 * @param emailSent Whether the email was sent successfully.
 * 
 * @deprecated we will not do this. Since CRON job control the number of times we sending email reminders.
 */
export async function updateTaskStatus(
  supabaseClient: SupabaseClient,
  taskIds: number[],
  emailSent: boolean,
) {
  if (taskIds.length === 0) return;

  const { error } = await supabaseClient
    .from('tasks')
    .update({ is_reminder_sent: emailSent })
    .in('id', taskIds);

  if (error) {
    console.error('Error updating task status:', error);
  }
}
