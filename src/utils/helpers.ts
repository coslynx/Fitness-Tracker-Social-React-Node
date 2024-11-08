import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  try {
    return format(date, 'MMMM do, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const sanitizeInput = (input: string) => {
  if (input.length > 255) {
    throw new Error('Input string exceeds maximum length'); 
  }
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};