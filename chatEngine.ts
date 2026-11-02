/**
 * Ask SAHAYINI chat engine (server side). Streams a Gemini answer so the first words reach the user quickly.
 *
 * Speed rules (the goal is roughly 2-5 seconds for a normal answer; it depends on Google's service):
 *  - streaming: the user starts reading as soon as the first words exist, not after the whole answer;
 *  - minimal "thinking" (falls back to the model default automatically if a model rejects the setting);
 *  - no sleeping between attempts: on overload, rate limit, timeout or an empty reply we go straight to the next model;
 *  - hard limits so a stalled service can never hang the request;
 *  - never an invented answer: if every model fails the caller gets an error code.
 */
import { encodeChatEvent } from './src/utils/chatStream';

export interface ChatEngineDeps {
  ai: { models: { generateContentStream: (p: any) => Promise<AsyncIterable<{ text?: string }>> } };
  models: readonly string[];
  /** Maps an SDK/network error to a stable code (busy, quota, timeout, ...). */
  classify: (err: unknown) => string;
  onError?: (err: unknown, model: string, attempt: number) => void;
  firstChunkTimeoutMs?: number;
  idleChunkTimeoutMs?: number;
  totalBudgetMs?: number;
  maxOutputTokens?: number;
}

export type ChatEngineEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; model: string; attempts: number; firstTextMs: number; totalMs: number };

export class ChatEngineError extends Error {
  code: string;
  attempts: number;
  /** True when some text had already been produced (so a model fallback was no longer possible). */
  partial: boolean;
  constructor(code: string, attempts: number, partial: boolean) {
    super(`chat failed: ${code}`);
    this.code = code;
    this.attempts = attempts;
    this.partial = partial;
  }
}

const ERROR_PRIORITY = ['invalid_api_key', 'busy', 'quota', 'timeout', 'network', 'empty', 'model_unavailable', 'unknown'];

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), Math.max(1, ms));
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

export function createChatEngine(deps: ChatEngineDeps) {
  const firstChunkTimeout = deps.firstChunkTimeoutMs ?? 9000;
  const idleTimeout = deps.idleChunkTimeoutMs ?? 8000;
  const totalBudget = deps.totalBudgetMs ?? 25000;
  const maxOutputTokens = deps.maxOutputTokens ?? 1200;
  // Remembered across requests: once a model rejects the thinking setting we stop sending it.
  let thinkingSupported = true;

  async function* stream(params: { contents: unknown; systemInstruction: string }): AsyncGenerator<ChatEngineEvent> {
    const started = Date.now();
    const seen = new Set<string>();
    let attempts = 0;

    outer: for (const model of deps.models) {
      let useThinking = thinkingSupported;
      for (let pass = 0; pass < 2; pass++) {
        const remaining = totalBudget - (Date.now() - started);
        if (remaining < 500) break outer;
        attempts++;
        let produced = false;
        try {
          const config: Record<string, unknown> = { systemInstruction: params.systemInstruction, maxOutputTokens };
          if (useThinking) config.thinkingConfig = { thinkingLevel: 'MINIMAL' };

          const iterable = await withTimeout(
            deps.ai.models.generateContentStream({ model, contents: params.contents, config }),
            Math.min(firstChunkTimeout, remaining),
            'stream start'
          );
          const it = iterable[Symbol.asyncIterator]();
          let firstTextMs = 0;
          for (;;) {
            const left = totalBudget - (Date.now() - started);
            const wait = produced ? Math.min(idleTimeout, left) : Math.min(firstChunkTimeout, left);
            const r = await withTimeout(it.next(), wait, produced ? 'stream chunk' : 'first chunk');
            if (r.done) break;
            const text = r.value?.text || '';
            if (!text) continue;
            if (!produced) firstTextMs = Date.now() - started;
            produced = true;
            yield { type: 'delta', text };
          }
          if (!produced) throw Object.assign(new Error('empty response'), { aiCode: 'empty' });
          yield { type: 'done', model, attempts, firstTextMs, totalMs: Date.now() - started };
          return;
        } catch (err) {
          const code = (err as { aiCode?: string }).aiCode ?? deps.classify(err);
          deps.onError?.(err, model, attempts);
          // Text already reached the user: switching model would mix two answers, so report the failure instead.
          if (produced) throw new ChatEngineError(code, attempts, true);
          // Model does not accept the thinking setting: retry the SAME model once without it (not a real failure).
          if (useThinking && pass === 0 && /thinking/i.test(String((err as Error)?.message ?? ''))) {
            thinkingSupported = false;
            useThinking = false;
            continue;
          }
          seen.add(code);
          if (code === 'invalid_api_key' || code === 'unknown') break outer; // another model cannot fix these
          break; // busy / quota / timeout / empty / 404: next model immediately, no sleeping
        }
      }
    }

    const finalCode = ERROR_PRIORITY.find((c) => seen.has(c)) ?? 'unknown';
    throw new ChatEngineError(finalCode, attempts, false);
  }

  return { stream, isThinkingSupported: () => thinkingSupported };
}

/** The few ServerResponse members used below (satisfied by Node's http.ServerResponse and Express's Response). */
export interface ChatResponseLike {
  statusCode: number;
  headersSent: boolean;
  setHeader(name: string, value: string): unknown;
  write(chunk: string): unknown;
  end(): unknown;
  flushHeaders?: () => void;
}

/** Collects a whole answer (used when the caller did not ask for streaming). Throws ChatEngineError on failure. */
export async function collectChat(gen: AsyncGenerator<ChatEngineEvent>): Promise<{ text: string; model: string; attempts: number }> {
  let text = '';
  let model = '';
  let attempts = 0;
  for await (const ev of gen) {
    if (ev.type === 'delta') text += ev.text;
    else {
      model = ev.model;
      attempts = ev.attempts;
    }
  }
  return { text: text.trim(), model, attempts };
}

/**
 * Streams the answer to the client as newline-delimited JSON. It waits for the FIRST words before sending any
 * headers, so a failure before that point is returned to the caller (who can reply with a normal JSON error and
 * status code) instead of being written to the response. After the first words, a failure is sent as an
 * {"type":"error"} line and the response is ended.
 */
export async function pipeChatStream(
  res: ChatResponseLike,
  gen: AsyncGenerator<ChatEngineEvent>,
  isClientGone: () => boolean = () => false,
  log: (line: string) => void = () => {}
): Promise<{ ok: true } | { ok: false; code: string }> {
  let ev: IteratorResult<ChatEngineEvent>;
  try {
    ev = await gen.next();
  } catch (err) {
    return { ok: false, code: (err as { code?: string }).code ?? 'unknown' };
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
  try {
    while (!ev.done) {
      if (isClientGone()) {
        await gen.return(undefined);
        return { ok: true };
      }
      const e = ev.value;
      if (e.type === 'delta') res.write(encodeChatEvent({ type: 'delta', text: e.text }));
      else {
        log(`[chat] model=${e.model} first text ${e.firstTextMs}ms, total ${e.totalMs}ms, attempts ${e.attempts}`);
        res.write(encodeChatEvent({ type: 'done', model: e.model }));
      }
      ev = await gen.next();
    }
  } catch (err) {
    res.write(encodeChatEvent({ type: 'error', code: (err as { code?: string }).code ?? 'unknown' }));
  }
  res.end();
  return { ok: true };
}
