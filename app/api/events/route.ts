import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { HackerEvent } from '@/types/hackerEvent';

// Define the GET API route handler
export async function GET() {
  try {

    // Auth
    const auth = new google.auth.GoogleAuth({
      projectId: process.env.GOOGLE_PROJECT_ID,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
      }
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Query data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Events!A2:I',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    // Map the rows to a structured HackerEvent array
    const events: HackerEvent[] = rows.map((row) => ({
      id: Number(row[0]),
      startTime: new Date(row[1]),
      endTime: new Date(row[2]),
      name: row[3],
      eventType: row[4],
      location: row[5],
      details: row[6] || '',
      needsScanning: row[7] === 'TRUE',
      netWorth: row[8],
    }));

    // Return the events data as JSON
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}
