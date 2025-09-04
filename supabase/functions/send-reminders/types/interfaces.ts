export interface Task {
  id: string;
  description: string;
  reminderTime: string;
  user_email: string;
  url?: string;
  isReminderSent: boolean;
  completed: boolean;
}

export interface CategorizedTasks {
  overdue: Task[];
  approaching: Task[];
  today: Task[];
}

export interface GroupedRecipient {
  email?: string;
  tasks: CategorizedTasks;
}
