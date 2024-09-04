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


// Utility function to calculate reading time
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  if (!text) return 0;

  const words = text.split(/\s+/).length; // Split text into words
  const readingTime = Math.ceil(words / wordsPerMinute); // Calculate reading time based on the average words per minute

  return readingTime; // Return the reading time in minutes
};
