import { z } from 'zod';

// Define password validation schema
const passwordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

// Function to validate password
export function validatePassword(password: string): string[] {
  try {
    passwordSchema.parse(password);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(e => e.message);
    } else {
      console.error('An unknown error occurred during password validation');
      return ['An unknown error occurred during password validation'];
    }
  }
}
