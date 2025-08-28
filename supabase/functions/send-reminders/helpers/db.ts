import { createClient } from 'npm:@supabase/supabase-js';
import { Task } from '../types/interfaces.ts';

// Helper to update task status
export async function updateTaskStatus(
  supabaseClient: ReturnType<typeof createClient>,
  taskIds: string[],
  emailSent: boolean,
  whatsappSent: boolean,
): Promise<void> {
  const updateData: { is_reminder_sent?: boolean; is_whatsapp_reminder_sent?: boolean } = {};
  if (emailSent) updateData.is_reminder_sent = true;
  if (whatsappSent) updateData.is_whatsapp_reminder_sent = true;

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
