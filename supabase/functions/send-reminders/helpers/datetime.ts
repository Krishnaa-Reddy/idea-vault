// Helper to format date/time naturally
export function formatReminderDateTime(dateString: string): {
  formattedDate: string;
} {
  const dueDate = new Date(dateString);
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return { formattedDate };
}
