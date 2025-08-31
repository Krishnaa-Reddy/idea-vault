import { Task } from '../../types/interfaces.ts';
import { formatReminderDateTime } from '../../helpers/datetime.ts';

// Helper to generate WhatsApp message text
export function formatWhatsappMessage(
  userTasks: Task[],
  YOUR_WEBSITE_BASE_URL: string | undefined,
): string {
  const taskListWhatsapp = userTasks
    .map((task) => {
      const { formattedDate, formattedTime } = formatReminderDateTime(task.reminderTime);
      return `\n* ${task.description}* - Due by ${formattedTime} on ${formattedDate}`; // Markdown for bold in WhatsApp
    })
    .join('');

  return `Hello from Idea Vault!\n\nThis is a friendly reminder that you have the following tasks due soon or overdue:\n${taskListWhatsapp}\n\nGo to your tasks: ${YOUR_WEBSITE_BASE_URL}/tasks\n\nPlease complete them soon.\n\nBest regards,\nYour Idea Vault Team`;
}

// Helper to send WhatsApp reminders
export async function sendWhatsappReminder(
  recipientWhatsapp: string,
  message: string,
  TWILIO_ACCOUNT_SID: string | undefined,
  TWILIO_AUTH_TOKEN: string | undefined,
  TWILIO_WHATSAPP_NUMBER: string | undefined,
): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    console.error('Twilio credentials not fully set up for WhatsApp');
    return false;
  }

  try {
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        },
        body: new URLSearchParams({
          To: `whatsapp:${recipientWhatsapp}`,
          From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          Body: message,
        }).toString(),
      },
    );

    const twilioData = await twilioResponse.json();

    if (twilioResponse.ok) {
      console.log('WhatsApp message sent to', recipientWhatsapp, twilioData);
      return true;
    } else {
      console.error('Error sending WhatsApp message to', recipientWhatsapp, twilioData);
      return false;
    }
  } catch (ex) {
    console.error('Exception while sending WhatsApp message to', recipientWhatsapp, ex);
    return false;
  }
}
