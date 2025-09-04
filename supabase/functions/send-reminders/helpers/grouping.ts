import { Task, GroupedRecipient } from '../types/interfaces.ts';

// Helper to group tasks by recipient

/**
 * 
 * @description why me to worry about this grouping.
 * Supabase can group the tasks for me by running a query.
 * So, find that apporach first and then delete this part here.
 * @param tasks 
 * @returns groupedTasks
 */

export function groupTasksByRecipient(categorized: {
  overdue: Task[];
  today: Task[];
  approaching: Task[];
}): Record<string, GroupedRecipient> {
  const grouped: Record<string, GroupedRecipient> = {};

  for (const category of Object.keys(categorized) as (keyof typeof categorized)[]) {
    for (const task of categorized[category]) {
      const recipientEmail = task.user_email || 'kundhurukrishnareddy@gmail.com';

      if (!grouped[recipientEmail]) {
        grouped[recipientEmail] = { email: recipientEmail, tasks: { overdue: [], today: [], approaching: [] } };
      }

      grouped[recipientEmail].tasks[category].push(task);
    }
  }

  return grouped;
}
