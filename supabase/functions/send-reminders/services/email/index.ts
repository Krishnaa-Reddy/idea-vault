import { differenceInCalendarDays } from 'npm:date-fns';
import { Resend } from 'npm:resend';
import { formatReminderDateTime } from '../../helpers/datetime.ts';
import { CategorizedTasks, Task } from '../../types/interfaces.ts';

// Helper to generate email HTML
export function formatEmailHtml(
  categorizedTasks: CategorizedTasks,
  YOUR_WEBSITE_BASE_URL: string | undefined,
): { subject: string; html: string } {
  const sections: string[] = [];

  function renderTasks(title: string, tasks: Task[], type: 'today' | 'approaching' | 'overdue') {
    if (tasks.length === 0) return '';
    const items = tasks
      .map((task) => {
        const dueDate = new Date(task.reminderTime);
        const daysDiff = differenceInCalendarDays(new Date(), dueDate);
        const { formattedDate } = formatReminderDateTime(task.reminderTime);

        let subtitle = '';
        if (type === 'today') subtitle = `Due Today (${formattedDate})`;
        if (type === 'approaching')
          subtitle = `Due in ${Math.abs(daysDiff)} days (${formattedDate})`;
        if (type === 'overdue')
          subtitle = `Overdue by ${Math.abs(daysDiff)} days (${formattedDate})`;

        return `
          <li style="margin-bottom: 10px; padding: 10px; border-left: 3px solid #007bff; background-color: #f8f9fa;">
            <h3 style="margin: 0; font-size: 16px; color: #333;"><strong>${task.title}</strong></h3>
            <p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">${subtitle}</p>
            ${task.url ? `<p style="margin: 5px 0 0; font-size: 14px; color: #6c757d;">Link: <a href="${task.url}" style="color: #007bff; text-decoration: none;">${task.url}</a></p>` : ''}
          </li>
        `;
      })
      .join('');

    return `
      <h2 style="color: #007bff;">${title}</h2>
      <ul style="list-style: none; padding: 0;">
        ${items}
      </ul>
    `;
  }

  sections.push(renderTasks('🔥 Tasks Due Today', categorizedTasks.today, 'today'));
  sections.push(renderTasks('⏳ Upcoming Tasks', categorizedTasks.approaching, 'approaching'));
  sections.push(renderTasks('❌ Overdue Tasks', categorizedTasks.overdue, 'overdue'));

  const allTasksCount =
    categorizedTasks.today.length +
    categorizedTasks.approaching.length +
    categorizedTasks.overdue.length;

  const subject = `Reminder: You have ${allTasksCount} task${allTasksCount > 1 ? 's' : ''} pending!`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #007bff;">Hello from Idea Vault!</h1>
      <p>This is a friendly reminder about your tasks:</p>
      ${sections.join('')}
      <p style="margin-top: 20px;">
        <a href="${YOUR_WEBSITE_BASE_URL}/tasks" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Go to My Tasks</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">Best regards,<br/>The Idea Vault Team</p>
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
      from: 'IdeaVault <noreply@ideavault.space>',
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
