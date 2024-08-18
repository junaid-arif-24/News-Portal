export function formatDate(date: string) {
  const d = new Date(date);
  const day = d.getDate(); // No need to pad the day with leading zero
  const month = d.toLocaleString('default', { month: 'long' }); // Get the full month name
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}


export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12; // Convert 0 hours to 12 for AM
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${adjustedHours}:${formattedMinutes} ${period}`;
};