
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