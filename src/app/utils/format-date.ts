import { DateTime } from 'luxon';

export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided to formatDate');
  }
  return DateTime.fromJSDate(date).toFormat('MMMM dd, yyyy');
};