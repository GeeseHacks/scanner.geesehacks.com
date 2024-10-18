import { z } from 'zod';

// Define email validation schema
const emailSchema = z.string().email({ message: 'Invalid email address' });

// Function to validate email
export function validateEmail(email: string): string {
  try {
    emailSchema.parse(email);
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(e => e.message).join(', ');
    } else {
      console.error('An unknown error occurred during email validation');
      return 'An unknown error occurred during email validation';
    }
  }
}
