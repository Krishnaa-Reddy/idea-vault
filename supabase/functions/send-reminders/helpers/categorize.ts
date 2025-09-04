import { differenceInCalendarDays, isPast, isToday } from 'npm:date-fns';
import { Task, CategorizedTasks } from '../types/interfaces.ts';

/**
 * @description Categorizes tasks into overdue, today, and approaching.
 * @param tasks The tasks to categorize.
 * @returns An object with the categorized tasks.
 */
export function categorizeTasks(tasks: Task[]): CategorizedTasks {
  const categorized: CategorizedTasks = {
    overdue: [],
    today: [],
    approaching: [],
  };

  for (const task of tasks) {
    if (!task.reminderTime) continue;

    const reminderDate = new Date(task.reminderTime);

    if (isToday(reminderDate)) {
      categorized.today.push(task);
    } else if (isPast(reminderDate)) {
      categorized.overdue.push(task);
    } else {
      const daysDiff = differenceInCalendarDays(reminderDate, new Date());
      if (daysDiff <= 3) {
        categorized.approaching.push(task);
      }
    }
  }

  return categorized;
}
