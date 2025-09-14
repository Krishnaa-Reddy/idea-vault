export interface Task {
  id: number;
  title: string;
  description: string;
  reminderTime: string;
  url?: string;
  is_reminder_sent: boolean;
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
