import type { WaCommand } from '@/types/whatsapp';

export function parseCommand(rawText: string): WaCommand {
  const trimmed = rawText.trim();
  const [verbRaw = '', ...rest] = trimmed.split(/\s+/);
  const verb = verbRaw.toUpperCase();
  const arg = rest.join(' ').trim();

  switch (verb) {
    case 'SAVE':
      return arg ? { verb: 'SAVE', arg } : { verb: 'UNKNOWN', arg: trimmed };
    case 'RUN':
      return arg ? { verb: 'RUN', arg } : { verb: 'UNKNOWN', arg: trimmed };
    case 'ARTICLE':
      return arg ? { verb: 'ARTICLE', arg } : { verb: 'UNKNOWN', arg: trimmed };
    case 'LIBRARY':
      return { verb: 'LIBRARY', arg: null };
    case 'HI':
    case 'HELLO':
    case 'START':
    case 'WELCOME':
      return { verb: 'WELCOME', arg: null };
    case 'VERIFY':
      return arg ? { verb: 'VERIFY', arg } : { verb: 'UNKNOWN', arg: trimmed };
    case 'HELP':
    case 'MENU':
    case 'STOP':
      return { verb: verb as 'HELP' | 'MENU' | 'STOP', arg: null };
    default:
      // Backwards compatibility: treat single keywords as RUN commands
      if (!arg && trimmed.length > 0 && !trimmed.includes(' ')) {
        return { verb: 'RUN', arg: trimmed.toUpperCase() };
      }
      return { verb: 'UNKNOWN', arg: trimmed };
  }
}
