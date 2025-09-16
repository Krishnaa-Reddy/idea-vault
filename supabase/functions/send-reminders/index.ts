// Setup Supabase Edge Runtime types
import 'https://deno.land/std@0.177.0/http/server.ts';
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js';
import { Resend } from 'npm:resend';

import { categorizeTasks } from './helpers/categorize.ts';
import { handleJobStatusUpdate } from './helpers/reminder_job_logs.db.ts';
import { getUsersWithTasks } from './helpers/users.db.ts';
import { formatEmailHtml, sendEmailReminder } from './services/email/index.ts';

Deno.serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  const YOUR_WEBSITE_BASE_URL = Deno.env.get('YOUR_WEBSITE_BASE_URL');
  let job_id: string | null = null;

  try {
    const body = await req.json();
    job_id = body.job_id;
    if (!job_id) {
      return new Response(JSON.stringify({ error: 'Missing job_id' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const payload = { request_status: 'processing', started_at: new Date().toISOString() };
    await handleJobStatusUpdate(supabaseClient, job_id, 'processing', payload);

    const usersWithTasks = await getUsersWithTasks(supabaseClient);

    if (usersWithTasks.length === 0) {
      await handleJobStatusUpdate(supabaseClient, job_id, 'completed', {
        request_status: 'completed',
        response: { message: 'No users with tasks to remind.' },
        finished_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ message: 'No users with tasks to remind.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    let emailsSentCount = 0;
    const recipientsProcessedCount = usersWithTasks.length;

    for (const user of usersWithTasks) {
      const categorizedTasks = categorizeTasks(user.tasks);

      const noTasks =
        categorizedTasks.overdue.length === 0 &&
        categorizedTasks.today.length === 0 &&
        categorizedTasks.approaching.length === 0;

      if (noTasks) {
        continue;
      }

      if (!user.email) {
        console.warn(`User with ID ${user.id} has no email address. Skipping.`);
        continue;
      }

      let emailSent = false;
      const userEmail = user.email;

      const { subject, html } = formatEmailHtml(categorizedTasks, YOUR_WEBSITE_BASE_URL);
      emailSent = await sendEmailReminder(resend, userEmail, subject, html);
      if (emailSent) emailsSentCount++;
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
