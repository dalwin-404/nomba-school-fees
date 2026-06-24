import { NextResponse } from 'next/server';
import { processWebhook } from '@/lib/webhook';
import { NOMBA_EVENTS } from '@/lib/constants';

export async function POST(request: Request) {
  if (process.env.NOMBA_PROVIDER !== 'mock') {
    return NextResponse.json({ error: 'Mock endpoints disabled in live mode' }, { status: 404 });
  }

  const { accountRef, amount, senderName, simulate } = await request.json();

  if (!accountRef || !amount) {
    return NextResponse.json({ error: 'accountRef and amount are required' }, { status: 400 });
  }

  const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const payload = {
    event: NOMBA_EVENTS.PAYMENT_SUCCESS,
    data: {
      id: transactionId,
      amount: Number(amount),
      currency: 'NGN',
      status: 'SUCCESS',
      senderName: senderName || 'Mock Sender',
      merchantTxRef: accountRef,
      orderReference: `ord_${Date.now()}`,
      timeCreated: new Date().toISOString(),
      paymentMethod: 'transfer',
    },
  };

  const rawBody = JSON.stringify(payload);
  const signature = 'mock_signature_we_dont_care';
  const timestamp = new Date().toISOString();

  // Process normally
  await processWebhook(rawBody, { signature, timestamp });

  if (simulate === 'duplicate') {
    // Process exact same payload again
    await processWebhook(rawBody, { signature, timestamp });
  }

  return NextResponse.json({ success: true, message: 'Mock webhook processed', transactionId });
}
