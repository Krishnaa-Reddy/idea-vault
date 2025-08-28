interface Task {
  id: string;
  description: string;
  reminderTime: string;
  user_email: string;
  whatsapp_number?: string;
  url?: string;
  is_reminder_sent: boolean;
  is_whatsapp_reminder_sent: boolean;
  completed: boolean;
}

interface GroupedRecipient {
  email?: string;
  whatsapp?: string;
  tasks: Task[];
}
