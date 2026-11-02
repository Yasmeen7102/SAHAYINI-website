/**
 * Ask SAHAYINI streaming protocol (newline-delimited JSON). Shared by the server and the browser so both
 * sides always agree on the format. Pure functions only.
 *   {"type":"delta","text":"..."}   a piece of the answer
 *   {"type":"done","model":"..."}   finished
 *   {"type":"error","code":"busy"}  failed after text had already started (no fallback is possible by then)
 */
export type ChatStreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; model?: string }
  | { type: 'error'; code: string; message?: string };

export const encodeChatEvent = (e: ChatStreamEvent): string => JSON.stringify(e) + '\n';

/** Splits a buffer into complete events and the unfinished remainder. Malformed lines are skipped. */
export function parseNdjsonLines(buffer: string): { events: ChatStreamEvent[]; rest: string } {
  const lines = buffer.split('\n');
  const rest = lines.pop() ?? '';
  const events: ChatStreamEvent[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    try {
      const e = JSON.parse(t);
      if (e && (e.type === 'delta' || e.type === 'done' || e.type === 'error')) events.push(e as ChatStreamEvent);
    } catch {
      /* ignore a damaged line */
    }
  }
  return { events, rest };
}

export interface ChatStreamResult {
  text: string;
  finished: boolean;
  errorCode?: string;
}

/** Reads a streamed /api/chat response and reports each piece of text as it arrives. */
export async function readChatStream(res: Response, onText: (fullTextSoFar: string) => void): Promise<ChatStreamResult> {
  if (!res.body) return { text: '', finished: false, errorCode: 'network' };
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let text = '';
  let finished = false;
  let errorCode: string | undefined;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parsed = parseNdjsonLines(buf);
      buf = parsed.rest;
      for (const e of parsed.events) {
        if (e.type === 'delta') {
          text += e.text;
          onText(text);
        } else if (e.type === 'done') finished = true;
        else if (e.type === 'error') errorCode = e.code;
      }
    }
    buf += decoder.decode();
    for (const e of parseNdjsonLines(buf + '\n').events) {
      if (e.type === 'delta') {
        text += e.text;
        onText(text);
      } else if (e.type === 'done') finished = true;
      else if (e.type === 'error') errorCode = e.code;
    }
  } catch {
    errorCode = errorCode || 'network';
  }
  return { text, finished, errorCode };
}
