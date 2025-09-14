import { createClient } from 'npm:@supabase/supabase-js';

// Helper function to update the job log status

export async function handleJobStatusUpdate(
  supabaseClient: ReturnType<typeof createClient>,
  jobId: string,
  status: 'queued' | 'processing' | 'completed' | 'failed',
  payload?: unknown,
) {
  await supabaseClient.from('reminder_job_logs').update(payload).eq('job_id', jobId);
}
