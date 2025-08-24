
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  description: string;
  url?: string;
  priority: Priority;
  reminderTime?: Date;
  completed: boolean;
  archived: boolean;
}
