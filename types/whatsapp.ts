export type WaCommand =
  | { verb: 'SAVE'; arg: string }
  | { verb: 'RUN'; arg: string }
  | { verb: 'ARTICLE'; arg: string }
  | { verb: 'LIBRARY'; arg: null }
  | { verb: 'HELP' | 'MENU' | 'STOP'; arg: null }
  | { verb: 'UNKNOWN'; arg: string };

export type WaMessage = {
  from: string;           // WhatsApp user ID
  text: string;           // Message content
  messageId: string;      // Unique message ID
  timestamp: number;      // Unix timestamp
};

export type WaResponse = {
  to: string;             // WhatsApp user ID
  text: string;           // Response text
  url?: string;           // Optional URL for rich preview
  preview_url?: boolean;  // Enable rich preview
};

export type SaveCard = {
  id: string;             // Short ID (e.g., "abc123")
  user_wa_id: string;     // WhatsApp user identifier
  type: 'tool' | 'blog' | 'external';
  source_id?: string;     // Tool/blog slug
  source_url?: string;    // External URL
  title: string;
  description: string;
  og_image_url: string;
  target_url: string;     // Redirect destination
  created_at: string;
};
