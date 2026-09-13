import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendAutomatedAdminWhatsApp } from '@/lib/whatsapp-notifier';

const dataFilePath = path.join(process.cwd(), 'data', 'bookings.json');

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      const bookings = JSON.parse(fileData);
      return NextResponse.json({ success: true, bookings });
    }
    return NextResponse.json({ success: true, bookings: [] });
  } catch (error) {
    console.error('Error reading bookings.json:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking, bookings: fullBookings } = body;

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (Array.isArray(fullBookings)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(fullBookings, null, 2), 'utf8');
      return NextResponse.json({
        success: true,
        message: 'All bookings updated successfully',
        bookings: fullBookings
      });
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'No booking payload provided' },
        { status: 400 }
      );
    }

    let bookings = [];
    if (fs.existsSync(dataFilePath)) {
      try {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        bookings = JSON.parse(fileData);
      } catch {}
    }

    // Prepend new booking with source method
    const enrichedBooking = {
      ...booking,
      bookingMethod: booking.bookingMethod || 'website',
      source: booking.source || (booking.bookingMethod === 'whatsapp' ? 'WhatsApp Direct' : 'Website Form'),
      status: booking.status || 'pending',
      createdAt: booking.createdAt || new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const updatedBookings = [enrichedBooking, ...bookings];

    fs.writeFileSync(dataFilePath, JSON.stringify(updatedBookings, null, 2), 'utf8');

    // -------------------------------------------------------------
    // Automated Server-side Management WhatsApp Notification Dispatch
    // -------------------------------------------------------------
    const dispatchResult = await sendAutomatedAdminWhatsApp(enrichedBooking);

    return NextResponse.json({
      success: true,
      message: 'Booking saved successfully and automated notification dispatched',
      booking: enrichedBooking,
      bookings: updatedBookings,
      whatsappDispatch: dispatchResult
    });
  } catch (error) {
    console.error('Error saving booking to bookings.json:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save booking' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

