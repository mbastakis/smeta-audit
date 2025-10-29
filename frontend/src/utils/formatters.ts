/**
 * Format file size from bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Format date to "MMM DD, YYYY" format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

/**
 * Get file icon color based on file type
 */
export function getFileIconColor(fileType: string): string {
  if (fileType.includes('pdf')) return '#d32f2f'; // Red
  if (fileType.includes('word') || fileType.includes('docx')) return '#1976d2'; // Blue
  if (fileType.includes('sheet') || fileType.includes('xlsx')) return '#2e7d32'; // Green
  if (fileType.includes('image') || fileType.includes('jpeg') || fileType.includes('png')) return '#7b1fa2'; // Purple
  return '#616161'; // Default gray
}

/**
 * Default export object with all formatters
 */
export const formatters = {
  formatFileSize,
  formatDate,
  getFileIconColor,
};
