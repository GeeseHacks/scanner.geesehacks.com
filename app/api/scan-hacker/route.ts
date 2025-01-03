import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma'; // Import your Prisma client
import { google } from 'googleapis';
import { z } from 'zod';

// Define the input schema using Zod
const assignEventSchema = z.object({
  qrCode: z.string().refine((code) => code.startsWith('https://portal.geesehacks.com/user/'), {
    message: 'QR code must start with https://portal.geesehacks.com/user/',
  }),
  eventId: z.string(),
});

// Function to fetch event data from Google Sheets
async function fetchEventValue(eventId: string): Promise<number> {
  try {
    const auth = new google.auth.GoogleAuth({
      projectId: process.env.GOOGLE_PROJECT_ID,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
      },
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Events!A2:I', // Update range as needed
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      throw new Error('No data found in the sheet');
    }

    // Find the row corresponding to the eventId
    const eventRow = rows.find((row) => row[0] === eventId);

    if (!eventRow) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    // Return the event value (assuming it's in column 8, index 7)
    return parseFloat(eventRow[8] || '0'); // Default to 0 if value is missing
  } catch (error) {
    console.error('Error fetching event value:', error);
    throw new Error('Error fetching event value');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body against the schema
    const validationResult = assignEventSchema.safeParse(body);

    if (!validationResult.success) {
      return new NextResponse(JSON.stringify({ error: validationResult.error.errors }), { status: 400 });
    }

    const { qrCode, eventId } = validationResult.data;

    // Find the user by QR code using Prisma
    const user = await prisma.user.findUnique({
      where: { event_qr_code: qrCode },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const currentEventIds = user.attendedEventIds as string[] || [];

    if (currentEventIds.includes(eventId)) {
      return new NextResponse(JSON.stringify({ error: 'Event ID already recorded.' }), { status: 409 });
    }

    // Fetch the event value from Google Sheets
    const eventValue = await fetchEventValue(eventId);

    // console.log(user.net_worth, eventValue)

    // Update the attendedEventIds and increment net_worth
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        attendedEventIds: [...currentEventIds, parseInt(eventId)],
        net_worth: user.net_worth + eventValue,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error('Error processing scan hacker request:', error);
    return new NextResponse(JSON.stringify({ message: 'Error processing request' }), { status: 500 });
  }
}
