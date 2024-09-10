import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body of the request
    const body = await request.json();
    const { qrCodeId, hackerId } = body;

    // Validate the input
    if (!qrCodeId || !hackerId) {
      return NextResponse.json({ error: 'Missing qrCodeId or hackerId' }, { status: 400 });
    }

    // Check if the hacker exists
    const hackerExists = await prisma.user.findUnique({
      where: { id: hackerId }
    });

    if (!hackerExists) {
      return NextResponse.json({ error: 'Hacker not found' }, { status: 404 });
    }

    // Link QR code to hacker ID
    const qrCode = await prisma.qRCodeRegistered.create({
      data: {
        qrCodeId: qrCodeId,
        userid: hackerId
      }
    });

    // Return the newly created QR code record
    return NextResponse.json(qrCode, { status: 201 });
    
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}