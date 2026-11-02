/**
 * Ask SAHAYINI online path: streaming engine (fallback / speed rules) and the NDJSON stream protocol.
 * The AI client is injected, so these tests exercise the real engine and parser without needing a network or API key.
 */
import http from 'node:http';
import { createChatEngine, ChatEngineError, collectChat, pipeChatStream } from '../../chatEngine';
import { encodeChatEvent, parseNdjsonLines, readChatStream } from './chatStream';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(`TEST FAILED: ${m}`);
}

const classify = (e: unknown) => {
  const m = String((e as Error)?.message ?? '').toLowerCase();
  if (m.includes('503')) return 'busy';
  if (m.includes('429')) return 'quota';
  if (m.includes('timed out')) return 'timeout';
  if (m.includes('api key')) return 'invalid_api_key';
  return 'unknown';
};

type Script = (model: string, config: any) => Promise<AsyncIterable<{ text?: string }>>;
const fakeAi = (script: Script, log: { model: string; config: any }[] = []) => ({
  models: {
    generateContentStream: async (p: any) => {
      log.push({ model: p.model, config: p.config });
      return script(p.model, p.config);
    },
  },
});
async function* chunks(parts: (string | Error)[], delayMs = 0) {
  for (const p of parts) {
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
    if (p instanceof Error) throw p;
    yield { text: p };
  }
}
async function collect(gen: AsyncGenerator<any>) {
  const events: any[] = [];
  for await (const e of gen) events.push(e);
  return events;
}
const params = { contents: [{ role: 'user', parts: [{ text: 'hi' }] }], systemInstruction: 'sys' };

async function main() {
  console.log('--- Ask SAHAYINI online engine tests ---');

  // 1) Normal streaming, minimal thinking requested, answer arrives in pieces
  {
    const log: any[] = [];
    const engine = createChatEngine({ ai: fakeAi(async () => chunks(['Call ', '112 ', 'now.']), log), models: ['m1', 'm2'], classify });
    const ev = await collect(engine.stream(params));
    assert(ev.filter((e) => e.type === 'delta').map((e) => e.text).join('') === 'Call 112 now.', 'deltas assemble the answer');
    assert(ev[ev.length - 1].type === 'done' && ev[ev.length - 1].model === 'm1', 'done event with model');
    assert(log.length === 1, 'exactly one API call for a healthy model');
    assert(log[0].config.thinkingConfig?.thinkingLevel === 'MINIMAL', 'minimal thinking requested');
    assert(log[0].config.systemInstruction === 'sys' && log[0].config.maxOutputTokens > 0, 'system prompt and output cap sent');
  }

  // 2) Overloaded model -> next model IMMEDIATELY (no sleep / same-model retry)
  {
    const log: any[] = [];
    const engine = createChatEngine({
      ai: fakeAi(async (m) => { if (m === 'm1') throw new Error('503 overloaded'); return chunks(['ok']); }, log),
      models: ['m1', 'm2'], classify,
    });
    const t0 = Date.now();
    const ev = await collect(engine.stream(params));
    assert(Date.now() - t0 < 300, 'no retry delay on overload');
    assert(log.map((l) => l.model).join() === 'm1,m2', 'went straight to the next model');
    assert(ev[ev.length - 1].model === 'm2', 'answered by fallback model');
  }

  // 3) A model that rejects the thinking setting: retried once WITHOUT it, and remembered
  {
    const log: any[] = [];
    const engine = createChatEngine({
      ai: fakeAi(async (_m, cfg) => { if (cfg.thinkingConfig) throw new Error('400 thinkingLevel is not supported by this model'); return chunks(['fine']); }, log),
      models: ['m1'], classify,
    });
    const ev = await collect(engine.stream(params));
    assert(ev[0].text === 'fine', 'answer still delivered');
    assert(log.length === 2 && !log[1].config.thinkingConfig, 'second call omits thinking config');
    assert(engine.isThinkingSupported() === false, 'remembered for later requests');
    await collect(engine.stream(params));
    assert(!log[2].config.thinkingConfig, 'later requests no longer send thinking config');
  }

  // 4) First chunk too slow -> next model
  {
    const log: any[] = [];
    const engine = createChatEngine({
      ai: fakeAi(async (m) => (m === 'm1' ? chunks(['late'], 400) : chunks(['quick'])), log),
      models: ['m1', 'm2'], classify, firstChunkTimeoutMs: 100,
    });
    const ev = await collect(engine.stream(params));
    assert(ev[ev.length - 1].model === 'm2' && ev[0].text === 'quick', 'slow first chunk triggers fallback');
  }

  // 5) Empty stream -> next model; all models failing -> error code, never an invented answer
  {
    const engine = createChatEngine({ ai: fakeAi(async () => chunks([])), models: ['m1', 'm2'], classify });
    let err: any = null;
    try { await collect(engine.stream(params)); } catch (e) { err = e; }
    assert(err instanceof ChatEngineError && err.code === 'empty' && !err.partial, 'all-empty reports an error');
    const busy = createChatEngine({ ai: fakeAi(async () => { throw new Error('503'); }), models: ['m1', 'm2', 'm3'], classify });
    err = null;
    try { await collect(busy.stream(params)); } catch (e) { err = e; }
    assert(err instanceof ChatEngineError && err.code === 'busy' && err.attempts === 3, 'busy everywhere: 3 attempts, code busy');
  }

  // 6) Invalid key stops at once (another model cannot help)
  {
    const log: any[] = [];
    const engine = createChatEngine({ ai: fakeAi(async () => { throw new Error('API key not valid'); }, log), models: ['m1', 'm2'], classify });
    let err: any = null;
    try { await collect(engine.stream(params)); } catch (e) { err = e; }
    assert(err.code === 'invalid_api_key' && log.length === 1, 'invalid key: one call only');
  }

  // 7) Failure after text started is reported as partial (no mixing of two models' answers)
  {
    const log: any[] = [];
    const engine = createChatEngine({ ai: fakeAi(async () => chunks(['Start ', new Error('503 dropped')]), log), models: ['m1', 'm2'], classify });
    const seen: string[] = [];
    let err: any = null;
    try { for await (const e of engine.stream(params)) if (e.type === 'delta') seen.push(e.text); } catch (e) { err = e; }
    assert(seen[0] === 'Start ' && err instanceof ChatEngineError && err.partial === true && log.length === 1, 'partial failure is not retried on another model');
  }

  // 8) Stream protocol: encode/parse incl. chunks split mid-line, damaged lines ignored
  {
    const a = encodeChatEvent({ type: 'delta', text: 'தமிழ் ✓' }) + encodeChatEvent({ type: 'done', model: 'm' });
    const p1 = parseNdjsonLines(a.slice(0, 20));
    assert(p1.events.length === 0 && p1.rest.length === 20, 'partial line kept as remainder');
    const p2 = parseNdjsonLines(p1.rest + a.slice(20) + 'not json\n');
    assert(p2.events.length === 2 && (p2.events[0] as any).text === 'தமிழ் ✓', 'unicode survives; damaged line skipped');
  }

  // 9) Browser reader against a real streamed Response (split in awkward places, multi-byte characters cut)
  {
    const payload = new TextEncoder().encode(
      encodeChatEvent({ type: 'delta', text: 'உதவி ' }) + encodeChatEvent({ type: 'delta', text: '112' }) + encodeChatEvent({ type: 'done' })
    );
    const body = new ReadableStream({
      start(c) {
        for (let i = 0; i < payload.length; i += 7) c.enqueue(payload.slice(i, i + 7));
        c.close();
      },
    });
    const progress: string[] = [];
    const r = await readChatStream(new Response(body), (t) => progress.push(t));
    assert(r.text === 'உதவி 112' && r.finished && !r.errorCode, 'reader reassembles text');
    assert(progress.length >= 2 && progress[0].length < r.text.length, 'text is reported progressively');
    const errBody = new Response(encodeChatEvent({ type: 'delta', text: 'x' }) + encodeChatEvent({ type: 'error', code: 'busy' }));
    const r2 = await readChatStream(errBody, () => {});
    assert(!r2.finished && r2.errorCode === 'busy' && r2.text === 'x', 'mid-stream error is surfaced');
  }

  // 10) End to end over a real HTTP connection, using the same stream-to-response code the server uses
  {
    const mode = { current: 'ok' as 'ok' | 'busy' };
    const engine = createChatEngine({
      ai: fakeAi(async () => {
        if (mode.current === 'busy') throw new Error('503');
        return chunks(['முதல் ', 'பகுதி ', 'இரண்டாம் ', 'பகுதி'], 120);
      }),
      models: ['m1'], classify,
    });
    const server = http.createServer(async (req, res) => {
      let body = '';
      for await (const c of req) body += c;
      const wantsStream = JSON.parse(body || '{}').stream === true;
      const gen = engine.stream(params);
      const json = (status: number, obj: unknown) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
      try {
        if (!wantsStream) { const r = await collectChat(gen); return json(200, { reply: r.text, source: 'gemini' }); }
        const out = await pipeChatStream(res as any, gen);
        if (!out.ok) return json(503, { error: out.code });
      } catch (e) { json(503, { error: (e as any).code ?? 'unknown' }); }
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const url = `http://127.0.0.1:${(server.address() as any).port}/api/chat`;
    const post = (stream: boolean) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'q', stream }) });

    // streamed: text shows up progressively, well before the answer is complete
    const t0 = Date.now();
    const res = await post(true);
    assert(res.ok && (res.headers.get('content-type') || '').includes('ndjson'), 'streamed response is ndjson');
    const stamps: number[] = [];
    const r = await readChatStream(res, () => stamps.push(Date.now() - t0));
    const total = Date.now() - t0;
    assert(r.finished && r.text === 'முதல் பகுதி இரண்டாம் பகுதி', 'full text received over HTTP');
    assert(stamps.length >= 3 && stamps[0] < total - 250, `first words at ${stamps[0]}ms, answer complete at ${total}ms (progressive)`);

    // non-streaming clients still get the previous JSON shape
    const plain = await (await post(false)).json();
    assert(plain.source === 'gemini' && plain.reply === 'முதல் பகுதி இரண்டாம் பகுதி', 'plain JSON still supported');

    // failure before any text: normal JSON error + status (so the app can show its Retry message)
    mode.current = 'busy';
    const bad = await post(true);
    assert(bad.status === 503 && (await bad.json()).error === 'busy', 'early failure is a JSON error, not a broken stream');
    await new Promise<void>((r) => server.close(() => r()));
  }

  console.log('✓ Ask SAHAYINI online engine tests passed');
}

// An unhandled rejection makes Node exit with a failure code, which fails `npm test`.
main().catch((e) => {
  console.error(e);
  throw e;
});
