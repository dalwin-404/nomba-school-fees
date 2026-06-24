import { createServiceClient } from '../supabase/server';
import { logError } from '../logger';

export interface WebhookLog {
  id: string;
  event_type: string;
  payload: any;
  processed: boolean;
  duplicate: boolean;
  error: string | null;
  request_id: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

export interface WebhookLogCreate {
  event_type: string;
  payload: any;
  request_id?: string;
}

export async function create(data: WebhookLogCreate): Promise<WebhookLog> {
  const supabase = createServiceClient();
  const { data: log, error } = await supabase
    .from('webhook_logs')
    .insert([data])
    .select()
    .single();

  if (error) {
    logError('db:webhook-logs', 'Error creating webhook log', { error, data });
    // Don't throw, we don't want to crash webhook processing just because logging failed
    return { id: 'fallback' } as WebhookLog;
  }
  return log;
}

export async function markProcessed(id: string, processingTimeMs: number): Promise<void> {
  if (id === 'fallback') return;
  const supabase = createServiceClient();
  await supabase
    .from('webhook_logs')
    .update({ processed: true, processing_time_ms: processingTimeMs })
    .eq('id', id);
}

export async function markDuplicate(id: string): Promise<void> {
  if (id === 'fallback') return;
  const supabase = createServiceClient();
  await supabase
    .from('webhook_logs')
    .update({ duplicate: true, processed: true })
    .eq('id', id);
}

export async function markError(id: string, errorMsg: string): Promise<void> {
  if (id === 'fallback') return;
  const supabase = createServiceClient();
  await supabase
    .from('webhook_logs')
    .update({ error: errorMsg })
    .eq('id', id);
}
