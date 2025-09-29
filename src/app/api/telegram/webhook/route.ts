import { NextRequest, NextResponse } from 'next/server';
import { processMessage } from '@/lib/bot-handlers';

export async function POST(request: NextRequest) {
  let update: any = null;
  
  try {
    update = await request.json();
    console.log('📨 Received Telegram update:', JSON.stringify(update, null, 2));

    // Process the update
    const result = await processMessage(update);
    console.log('✅ Message processed successfully:', result);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    // Try to send error message to user if possible
    try {
      if (update?.message?.chat?.id) {
        const { sendMessage } = await import('@/lib/telegram');
        await sendMessage(update.message.chat.id, '❌ Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.');
      }
    } catch (sendError) {
      console.error('Failed to send error message:', sendError);
    }
    
    // Return success to prevent Telegram from retrying
    return NextResponse.json({ 
      ok: true, 
      error: 'Processed with errors',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' });
}
