import { NextRequest, NextResponse } from 'next/server';
import { getBot } from '@/lib/telegram';
import { processMessage } from '@/lib/bot-handlers';

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    console.log('Received Telegram update:', JSON.stringify(update, null, 2));

    // Process the update
    await processMessage(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' });
}
