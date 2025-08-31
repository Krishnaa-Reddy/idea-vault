import { DateTime } from 'luxon';

export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided to formatDate');
  }
  return DateTime.fromJSDate(date).toFormat('MMMM dd, yyyy');
};

export const dateToISO = (reminderTime: Date | null): string | null => {
  if (!reminderTime) return null;
  const reminderDateTime = new Date(reminderTime);
  reminderDateTime.setHours(9, 0, 0, 0);
  return reminderDateTime.toISOString();
};


export const ISOtoDate = (reminderTime?: string | null): Date | null => {
  if (!reminderTime) return null;
  return new Date(reminderTime);
};