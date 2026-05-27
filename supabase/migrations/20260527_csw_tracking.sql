-- Customer Service Window (CSW) tracking for WhatsApp free-tier messaging
-- Meta only allows free-form messages within 24h of the user's last inbound message.
-- We track last_inbound_at per user and queue messages when the window is closed.

-- When the user last messaged us (resets the 24h free window)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_inbound_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_users_last_inbound_at ON users (last_inbound_at);

-- Messages to deliver the next time the CSW opens for this phone number
CREATE TABLE IF NOT EXISTS whatsapp_pending_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        TEXT NOT NULL,          -- E.164 format (+447...)
  message_text TEXT NOT NULL,
  preview_url  BOOLEAN NOT NULL DEFAULT false,
  source       TEXT NOT NULL DEFAULT 'unknown',  -- 'save-to-phone', 'weekly-broadcast', etc.
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ             -- NULL = waiting; set when sent
);

-- Partial index — only undelivered rows need fast lookup by phone
CREATE INDEX IF NOT EXISTS idx_pending_messages_phone_undelivered
  ON whatsapp_pending_messages (phone)
  WHERE delivered_at IS NULL;
