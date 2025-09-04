import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { Task } from '../types/interfaces.ts';

export interface User {
  id: string;
  email: string | undefined;
  tasks: Task[];
};

/**
 * @description Fetches users who have reminders enabled and their tasks by calling the `get_users_with_tasks_to_remind` database function.
 * @param supabaseClient The Supabase client instance.
 * @returns A promise that resolves to an array of users with their tasks.
 */
export async function getUsersWithTasks(
  supabaseClient: SupabaseClient,
): Promise<User[]> {
  const { data, error } = await supabaseClient.rpc('get_users_with_tasks_to_remind');

  if (error) {
    console.error('Error fetching users and tasks:', error);
    throw new Error('Could not fetch users and their tasks.');
  }

  return data as User[];
}