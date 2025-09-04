// Setup Supabase Edge Runtime types
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import 'https://deno.land/std@0.177.0/http/server.ts';

import { createClient } from 'npm:@supabase/supabase-js';
import { Resend } from 'npm:resend';

import { fetchCategorizedTasks, updateTaskStatus } from './helpers/tasks.db.ts';
import { groupTasksByRecipient } from './helpers/grouping.ts';
import { formatEmailHtml, sendEmailReminder } from './services/email/index.ts';
import { handleJobStatusUpdate } from './helpers/reminder_job_logs.db.ts';

Deno.serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  const YOUR_WEBSITE_BASE_URL = Deno.env.get('YOUR_WEBSITE_BASE_URL');
  let job_id: string | null = null;

  try {
    // Parse request body (must contain job_id)
    const body = await req.json();
    job_id = body.job_id;
    if (!job_id) {
      return new Response(JSON.stringify({ error: 'Missing job_id' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Mark job as processing
    const payload = { request_status: 'processing', started_at: new Date().toISOString() };
    await handleJobStatusUpdate(supabaseClient, job_id, 'processing', payload);
    // Fetch categorized tasks
    const tasks = await fetchCategorizedTasks(supabaseClient);

    // Check if all categories are empty
    const noTasks =
      tasks.overdue.length === 0 && tasks.today.length === 0 && tasks.approaching.length === 0;

    if (noTasks) {
      await handleJobStatusUpdate(supabaseClient, job_id, 'completed', {
        request_status: 'completed',
        response: { message: 'No tasks found for today.' },
        finished_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ message: 'No tasks found for today.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Process tasks by recipient
    const groupedTasks = groupTasksByRecipient(tasks);
    let emailsSentCount = 0;
    const recipientsProcessedCount = Object.keys(groupedTasks).length;

    for (const recipientKey in groupedTasks) {
      const group = groupedTasks[recipientKey];
      const userTasks = group.tasks;

      let emailSent = false;

      // Send email reminder
      if (group.email) {
        const { subject, html } = formatEmailHtml(userTasks, YOUR_WEBSITE_BASE_URL);
        emailSent = await sendEmailReminder(resend, group.email, subject, html);
        if (emailSent) emailsSentCount++;
      }

      // Update task status
      const taskIdsToUpdate = [
        ...userTasks.overdue.map((t) => t.id),
        ...userTasks.today.map((t) => t.id),
        ...userTasks.approaching.map((t) => t.id),
      ];
      
      await updateTaskStatus(supabaseClient, taskIdsToUpdate, emailSent);
      
    }

    const responseMessage = `Processed ${recipientsProcessedCount} recipients, sent ${emailsSentCount} emails.`;

    await handleJobStatusUpdate(supabaseClient, job_id, 'completed', {
      request_status: 'completed',
      status_code: 200,
      response: {
        message: responseMessage,
        emailsSent: emailsSentCount,
        recipientsProcessed: recipientsProcessedCount,
      },
      finished_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        message: responseMessage,
        emailsSent: emailsSentCount,
        recipientsProcessed: recipientsProcessedCount,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (err) {
    console.error('Edge function error:', err);

    if (job_id) {
      await handleJobStatusUpdate(supabaseClient, job_id, 'failed', {
        request_status: 'failed',
        error: err.message || 'Unknown error',
        finished_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ error: err.message || 'Unexpected error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
