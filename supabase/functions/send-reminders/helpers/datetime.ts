// Helper to format date/time naturally
export function formatReminderDateTime(dateString: string): { formattedDate: string; formattedTime: string } {
  const dueDate = new Date(dateString);
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return { formattedDate, formattedTime };
}
