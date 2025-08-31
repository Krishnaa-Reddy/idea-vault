import { Tables, TablesInsert, TablesUpdate } from '../../../database.types';

export type Priority = 'High' | 'Medium' | 'Low';
/**
 * Defines the possible statuses for a task.
 * - 'new': Tasks created on the current day.
 * - 'pending': Tasks that are not new, not completed, and not archived.
 * - 'completed': Tasks marked as completed.
 * - 'archived': Tasks marked as archived.
 *
 */
export type Status = 'new' | 'pending' | 'completed' | 'archived';

type TASKS_TABLE = 'tasks';

export type Task = Tables<TASKS_TABLE>;
export type TaskInsert = TablesInsert<TASKS_TABLE>;
export type TaskUpdate = TablesUpdate<TASKS_TABLE>;
