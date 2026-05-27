/**
 * Customer Service Window (CSW) helpers
 *
 * Meta's WhatsApp pricing (effective July 1, 2025) charges per message.
 * Service/free-form messages are FREE only when sent within 24 hours of
 * the user's last inbound message (the "customer service window").
 *
 * Strategy:
 *   - When a user messages us → record last_inbound_at, drain their queue.
 *   - When we want to send proactively → if CSW open, send free; else queue.
 *   - Queue is drained automatically on the next inbound from that user.
 */

import { createClient } from '@supabase/supabase-js';

/** How long (ms) the customer service window stays open after an inbound message. */
const CSW_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Safety margin: treat window as closed 2 min before actual expiry to avoid races. */
const CSW_SAFETY_MS = 2 * 60 * 1000;

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Normalise to the +E.164 format stored in the users table.
 * Meta delivers phone numbers without the leading '+'.
 */
export function normalisePhone(phone: string): string {
  return phone.startsWith('+') ? phone : `+${phone}`;
}

/**
 * Record that this user just sent us a message.
 * Call this on every inbound webhook event to reset/open their CSW.
 */
export async function touchLastInbound(phone: string): Promise<void> {
  const normalised = normalisePhone(phone);
  const admin = getAdmin();
  await admin
    .from('users')
    .update({ last_inbound_at: new Date().toISOString() })
    // match both +447... and 447... in case of format variance in DB
    .or(`whatsapp_number.eq.${normalised},whatsapp_number.eq.${phone}`);
}

/**
 * Returns true when the 24-hour customer service window is currently open
 * for the given phone number (i.e. they messaged us recently).
 */
export async function isCSWOpen(phone: string): Promise<boolean> {
  const normalised = normalisePhone(phone);
  const admin = getAdmin();
  const { data } = await admin
    .from('users')
    .select('last_inbound_at')
    .or(`whatsapp_number.eq.${normalised},whatsapp_number.eq.${phone}`)
    .maybeSingle();

  if (!data?.last_inbound_at) return false;
  const age = Date.now() - new Date(data.last_inbound_at).getTime();
  return age < CSW_MS - CSW_SAFETY_MS;
}

/**
 * Queue a message for delivery the next time the CSW opens.
 * Phone should be in +E.164 format; we normalise anyway.
 */
export async function queueMessage(
  phone: string,
  text: string,
  source: string,
  previewUrl = false
): Promise<void> {
  const admin = getAdmin();
  await admin.from('whatsapp_pending_messages').insert({
    phone: normalisePhone(phone),
    message_text: text,
    preview_url: previewUrl,
    source,
  });
}

/**
 * Fetch all pending messages for this phone, mark them delivered,
 * and return them ready to be sent.
 *
 * Call this inside the webhook handler, after touchLastInbound, so
 * queued messages are flushed as soon as the CSW opens.
 */
export async function drainPendingMessages(
  phone: string
): Promise<Array<{ text: string; preview_url: boolean }>> {
  const normalised = normalisePhone(phone);
  const admin = getAdmin();

  const { data, error } = await admin
    .from('whatsapp_pending_messages')
    .select('id, message_text, preview_url')
    .eq('phone', normalised)
    .is('delivered_at', null)
    .order('created_at', { ascending: true })
    .limit(10); // cap per interaction to avoid message floods

  if (error || !data?.length) return [];

  const ids = data.map(r => r.id);
  await admin
    .from('whatsapp_pending_messages')
    .update({ delivered_at: new Date().toISOString() })
    .in('id', ids);

  return data.map(r => ({
    text: r.message_text as string,
    preview_url: (r.preview_url as boolean) ?? false,
  }));
}
