// Diagnostic: shows which Gemini models YOUR API key can use, and makes one tiny test call to each
// model in SAHAYINI's chain. Run:  npm run check:ai
// The key is read from GEMINI_API_KEY (server environment / .env) and is never printed.
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { buildModelChain } from '../aiModels';

dotenv.config();

const PLACEHOLDERS = new Set(['', 'MY_GEMINI_API_KEY', 'YOUR_API_KEY', 'YOUR_GEMINI_API_KEY']);
const key = (process.env.GEMINI_API_KEY || '').trim();
if (PLACEHOLDERS.has(key)) {
  console.error('GEMINI_API_KEY is missing (or still the placeholder). Put your real key in .env and run again.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: key });
const chain = buildModelChain(process.env.GEMINI_MODEL);
const redact = (m: string) => m.split(key).join('[redacted]').slice(0, 200);

async function main() {
  // 1) Models this key can see (models.list)
  const visible = new Set<string>();
  try {
    const pager: any = await ai.models.list();
    for await (const m of pager) {
      const actions: string[] | undefined = m?.supportedActions;
      if (!actions || actions.includes('generateContent')) visible.add(String(m?.name || '').replace(/^models\//, ''));
    }
    const flash = [...visible].filter((n) => /^gemini-\d/.test(n) && /flash/.test(n) && !/(image|live|tts|audio|transcribe|omni)/.test(n)).sort();
    console.log('Flash text models your key can list:\n  ' + (flash.join('\n  ') || '(none found)'));
  } catch (e: any) {
    console.log(`Could not list models (${e?.status ?? 'error'}): ${redact(String(e?.message ?? e))}`);
  }

  // 2) Real test call per model in the chain
  console.log('\nTest call per model in SAHAYINI chain:');
  let usable = 0;
  for (const model of chain) {
    const t0 = Date.now();
    const listed = visible.size ? (visible.has(model) ? 'listed' : 'NOT listed') : 'list n/a';
    try {
      const r: any = await ai.models.generateContent({ model, contents: 'Reply with the single word: OK' });
      usable++;
      console.log(`  ${model.padEnd(24)} [${listed}] OK     ${Date.now() - t0}ms  -> "${String(r.text || '').trim().slice(0, 30)}"`);
    } catch (e: any) {
      console.log(`  ${model.padEnd(24)} [${listed}] FAILED status=${e?.status ?? 'n/a'} ${redact(String(e?.message ?? e))}`);
    }
  }
  console.log(`\n${usable}/${chain.length} models usable right now.`);
  process.exit(usable > 0 ? 0 : 1);
}
main();
