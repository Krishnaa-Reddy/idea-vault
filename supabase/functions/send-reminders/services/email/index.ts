import { Task } from '../../types/interfaces.ts';
import { formatReminderDateTime } from '../../helpers/datetime.ts';

// Helper to generate email HTML
export function formatEmailHtml(
  userTasks: Task[],
  YOUR_WEBSITE_BASE_URL: string | undefined,
): { subject: string; html: string } {
  const taskListHtml = userTasks
    .map((task) => {
      const { formattedDate, formattedTime } = formatReminderDateTime(task.reminderTime);
      return `
        <li style="margin-bottom: 10px; padding: 10px; border-left: 3px solid #007bff; background-color: #f8f9fa;">
          <h3 style="margin: 0; font-size: 16px; color: #333;"><strong>${task.description}</strong></h3>
          <p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">Due by ${formattedTime} on ${formattedDate}</p>
          ${task.url ? `<p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">Link: <a href="${task.url}" style="color: #007bff; text-decoration: none;">${task.url}</a></p>` : ''}
        </li>
      `;
    })
    .join('');

  const subject = `Reminder: You have ${userTasks.length} pending task${userTasks.length > 1 ? 's' : ''}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #007bff;">Hello from Idea Vault!</h1>
      <p>This is a friendly reminder that you have the following tasks due soon or overdue:</p>
      <ul style="list-style: none; padding: 0;">
        ${taskListHtml}
      </ul>
      <p>Please take a moment to review and complete them soon.</p>
      <p style="margin-top: 20px;">
        <a href="${YOUR_WEBSITE_BASE_URL}/tasks" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Go to My Tasks</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">Best regards,<br/>Your Idea Vault Team</p>
    </div>
  `;
  return { subject, html };
}

// Helper to send email reminders
export async function sendEmailReminder(
  resend: Resend,
  recipientEmail: string,
  subject: string,
  html: string,
): Promise<boolean> {
  try {
    const { error: sendError } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified Resend domain email
      to: recipientEmail,
      subject: subject,
      html: html,
    });
    if (sendError) {
      console.error('Error sending email to', recipientEmail, sendError);
      return false;
    }
    console.log('Email sent to', recipientEmail);
    return true;
  } catch (ex) {
    console.error('Exception while sending email to', recipientEmail, ex);
    return false;
  }
}
