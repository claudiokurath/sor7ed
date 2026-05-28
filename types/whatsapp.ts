export type WaCommand =
  | { verb: 'SAVE'; arg: string }
  | { verb: 'RUN'; arg: string }
  | { verb: 'ARTICLE'; arg: string }
  | { verb: 'LIBRARY'; arg: null }
  | { verb: 'WELCOME'; arg: null }
  | { verb: 'HELP' | 'MENU' | 'STOP'; arg: null }
  | { verb: 'VERIFY'; arg: string }
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
  id: string;
  user_id: string | null;
  phone: string;
  url: string;
  title: string;
  category: string;
  saved_at: string;
};
