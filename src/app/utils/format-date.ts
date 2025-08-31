import { DateTime } from 'luxon';

export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided to formatDate');
  }
  return DateTime.fromJSDate(date).toFormat('MMMM dd, yyyy');
};

export const dateToISO = (reminderTime: Date | null): string | null => {
  return reminderTime ? reminderTime.toISOString() : null;
};

export const ISOtoDate = (reminderTime?: string | null): Date | null => {
  return reminderTime ? DateTime.fromISO(reminderTime).toJSDate() : null;
};
