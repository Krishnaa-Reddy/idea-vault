import { DateTime } from 'luxon';

export const dateToISO = (reminderTime: Date | null): string | null => {
  return reminderTime ? reminderTime.toISOString() : null;
};

export const ISOtoDate = (reminderTime?: string | null): Date | null => {
  return reminderTime ? DateTime.fromISO(reminderTime).toJSDate() : null;
};
