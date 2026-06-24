import { NextResponse } from 'next/server';
import { processWebhook } from '@/lib/webhook';
import { logError } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('nomba-signature') || '';
    const timestamp = request.headers.get('nomba-timestamp') || '';

    // We process the webhook asynchronously or await it.
    // Given the constraints of serverless, we should await it, but we MUST return 200 regardless of internal errors
    // to prevent the provider from endlessly retrying a broken payload.
    await processWebhook(rawBody, { signature, timestamp });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logError('api:webhooks', 'Unhandled error in webhook route', { error: String(error) });
    // Still return 200 to prevent retries of bad payloads
    return NextResponse.json({ success: true, note: 'Error caught internally' });
  }
}
