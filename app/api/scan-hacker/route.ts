import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma'; // Import your Prisma client
import { z } from 'zod';

// Define the input schema using Zod
const assignEventSchema = z.object({
  qrCode: z.string().refine((code) => code.startsWith('https://portal.geesehacks.com/user/'), {
    message: 'QR code must start with https://portal.geesehacks.com/user/',
  }), // Validate that the QR code starts with the specified URL
  eventId: z.string(), // Validate that the eventId is a valid UUID
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

    const { qrCode, eventId } = validationResult.data;
    
    // Find the user by QR code using Prisma
    const user = await prisma.user.findUnique({
      where: { event_qr_code: qrCode }, // Query by QR code
    });

    // If the user is not found, return a 404 error
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Get current attendedEventIds or initialize to an empty array
    const currentEventIds = user.attendedEventIds as string[] || []; // Explicitly cast to string[]

    // Check if the eventId is already in the array
    if (currentEventIds.includes(eventId)) {
      // If the eventId already exists, return a 409 error
      return new NextResponse(JSON.stringify({ error: 'Event ID already recorded.' }), { status: 409 });
    }

    // Update the attendedEventIds field
    const updatedUser = await prisma.user.update({
      where: { id: user.id }, // Use the user's ID
      data: {
        attendedEventIds: [...currentEventIds, eventId], // Append the new eventId
      },
    });

    // Return the updated user information as a response
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);

    // Return a 500 error in case of server errors
    return new NextResponse(JSON.stringify({ error: 'An error occurred while assigning the event ID' }), { status: 500 });
  }
}
