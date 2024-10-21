import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma'; // Import your Prisma client
import { z } from 'zod';

// Define the input schema using Zod
const assignEventSchema = z.object({
  email: z.string().email(), // Validate that the input is a valid email
  qrCode: z.string().refine((code) => code.startsWith('https://portal.geesehacks.com/user/'), {
    message: 'QR code must start with https://portal.geesehacks.com/user/',
  }), // Validate that the QR code starts with the specified URL
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log(body);

    // Validate the request body against the schema
    const validationResult = assignEventSchema.safeParse(body);

    // If validation fails, return a 400 error with validation details
    if (!validationResult.success) {
      console.log(validationResult.error.errors);
      return new NextResponse(JSON.stringify({ error: validationResult.error.errors }), { status: 400 });
    }

    const { email, qrCode } = validationResult.data;
    console.log("Validation passed", email, qrCode);
    
    // Find the user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user is not found, return a 404 error
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Update the user's entry by storing the QR code
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        event_qr_code: qrCode,
      },
    });

    // Return the updated user information as a response
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);

    // Return a 500 error in case of server errors
    return new NextResponse(JSON.stringify({ error: 'An error occurred while assigning the QR code' }), { status: 500 });
  }
}
