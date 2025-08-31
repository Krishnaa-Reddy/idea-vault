// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import 'https://deno.land/std@0.177.0/http/server.ts';
import 'https://deno.land/x/dotenv/load.ts';
import { createClient } from 'npm:@supabase/supabase-js';
import { Resend } from 'npm:resend';

import { fetchOverdueTasks } from './helpers/tasks.ts';
import { groupTasksByRecipient } from './helpers/grouping.ts';
import { formatReminderDateTime } from './helpers/datetime.ts';
import { updateTaskStatus } from './helpers/db.ts';
import { formatEmailHtml, sendEmailReminder } from './services/email/index.ts';
import { formatWhatsappMessage, sendWhatsappReminder } from './services/whatsapp/index.ts';

console.log('Hello from Functions!');

Deno.serve(async () => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  const YOUR_WEBSITE_BASE_URL = Deno.env.get('YOUR_WEBSITE_BASE_URL');

  const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
  const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
  const TWILIO_WHATSAPP_NUMBER = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

  let emailsSentCount = 0;
  let whatsappMessagesSentCount = 0;
  let recipientsProcessedCount = 0;

  try {
    const tasks = await fetchOverdueTasks(supabaseClient);

    if (!tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ message: 'No overdue tasks found.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const groupedTasks = groupTasksByRecipient(tasks);
    recipientsProcessedCount = Object.keys(groupedTasks).length;

    for (const recipientKey in groupedTasks) {
      const group = groupedTasks[recipientKey];
      const userTasks = group.tasks;

      let emailSent = false;
      let whatsappSent = false;

      // Send Email Reminder
      if (group.email) {
        const { subject, html } = formatEmailHtml(userTasks, YOUR_WEBSITE_BASE_URL);
        emailSent = await sendEmailReminder(resend, group.email, subject, html);
        if (emailSent) emailsSentCount++;
      }

      // Send WhatsApp Reminder
      if (group.whatsapp) {
        const message = formatWhatsappMessage(userTasks, YOUR_WEBSITE_BASE_URL);
        whatsappSent = await sendWhatsappReminder(
          group.whatsapp,
          message,
          TWILIO_ACCOUNT_SID,
          TWILIO_AUTH_TOKEN,
          TWILIO_WHATSAPP_NUMBER,
        );
        if (whatsappSent) whatsappMessagesSentCount++;
      }

      // Update task status for the tasks in this group
      const taskIdsToUpdate = userTasks.map((task) => task.id);
      await updateTaskStatus(supabaseClient, taskIdsToUpdate, emailSent, whatsappSent);
    }

    const responseMessage = `Reminder emails processed. Sent ${emailsSentCount} email${emailsSentCount === 1 ? '' : 's'} and ${whatsappMessagesSentCount} WhatsApp message${whatsappMessagesSentCount === 1 ? '' : 's'} to ${recipientsProcessedCount} recipient${recipientsProcessedCount === 1 ? '' : 's'}.`;
    return new Response(
      JSON.stringify({
        message: responseMessage,
        emailsSent: emailsSentCount,
        whatsappMessagesSent: whatsappMessagesSentCount,
        recipientsProcessed: recipientsProcessedCount,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (initialError) {
    console.error('Unhandled error in Deno.serve:', initialError);
    return new Response(
      JSON.stringify({ error: initialError.message || 'An unexpected error occurred.' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-reminders' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
