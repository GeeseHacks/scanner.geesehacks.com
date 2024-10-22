import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Validation schemas for email and password, copied from lib/passwordUtils.ts
const passwordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

const emailSchema = z.string().email({ message: 'Invalid email address' });

// Define the schema for the request body using Zod
const requestBodySchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  try {
    const body = await req.json();
    
    // Validate the request body using Zod
    const validationResult = requestBodySchema.safeParse(body);

    // If validation fails, return a 400 error with validation message
    if (!validationResult.success) {
      return new NextResponse(JSON.stringify({ message: validationResult.error.errors }), { status: 400 });
    }

    const { email, password } = validationResult.data;

    // Check if the user already exists
    const existingUser = await prisma.userAuth.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'User already exists' }), { status: 409 });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = await prisma.userAuth.create({
      data: {
        id: "100",
        email,
        password: hashedPassword,
        resetToken: null,
        tokenExpiration: null
      },
    });

    return new NextResponse(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to create user' }), { status: 500 });
  }
}
