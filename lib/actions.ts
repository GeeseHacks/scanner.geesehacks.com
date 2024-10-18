'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(email: string, password: string) {
  try {
    await signIn('credentials', {redirectTo: '/', email: email, password: password});
    return {}; // No error means success
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };;
        default:
          return { error: "Something unexpected occured" };;
      }
    }
    console.log(error);
    throw error;
  }
}
