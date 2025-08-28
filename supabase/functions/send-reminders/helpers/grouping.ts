import { Task, GroupedRecipient } from '../types/interfaces.ts';

// Helper to group tasks by recipient
export function groupTasksByRecipient(tasks: Task[]): { [key: string]: GroupedRecipient } {
  const groupedTasks: { [key: string]: GroupedRecipient } = {};
  for (const task of tasks) {
    const recipientEmail = task.user_email || 'kundhurukrishnareddy@gmail.com';
    const whatsappNumber = task.whatsapp_number || '+916304197695'; // Fallback for testing

    if (recipientEmail) {
      if (!groupedTasks[recipientEmail]) {
        groupedTasks[recipientEmail] = { tasks: [] };
      }
      groupedTasks[recipientEmail].email = recipientEmail;
      groupedTasks[recipientEmail].tasks.push(task);
    }
    if (whatsappNumber && whatsappNumber !== recipientEmail) {
      if (!groupedTasks[whatsappNumber]) {
        groupedTasks[whatsappNumber] = { tasks: [] };
      }
      groupedTasks[whatsappNumber].whatsapp = whatsappNumber;
      groupedTasks[whatsappNumber].tasks.push(task);
    }
  }
  return groupedTasks;
}
