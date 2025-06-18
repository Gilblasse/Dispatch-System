export function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateForDisplay(date: Date): string {
  return new Date().toDateString() === date.toDateString()
    ? 'Today'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
