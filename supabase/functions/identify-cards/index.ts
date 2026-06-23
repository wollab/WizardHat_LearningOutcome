// Edge Function: "identify-cards" — reads a photo of physical Wizard Hat cards
// and returns which cards (by card_no) it thinks it sees. OPENAI_API_KEY is
// a Supabase secret (set with `supabase secrets set OPENAI_API_KEY=...`),
// never shipped to the client. Always treat the result as a suggestion — the
// app shows it as an editable checklist (CardConfirmList) before scoring.
import cardData from '../../../src/data/wizard_hat_learning_data.json' with { type: 'json' };

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const MODEL = 'gpt-4o';

const CARD_INDEX = (cardData as any[])
  .map((c) => `${c.card_no}: ${c.nameTh} / ${c.mechanic_name}`)
  .join('\n');

function assertDataUrl(dataUrl: string) {
  if (!/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(dataUrl)) {
    throw new Error('invalid_image_data');
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { image } = await req.json();
    if (!image) return json({ error: 'missing_image' }, 400);
    assertDataUrl(image);

    const prompt = `You are looking at a photo of physical "Wizard Hat" game design cards laid out by a user.
Here is the full list of valid cards (card_no: Thai name / English mechanic name):

${CARD_INDEX}

Identify which of these cards appear in the photo. Only include cards you are reasonably confident
are visible (legible name or clearly recognizable). Respond with ONLY strict JSON, no prose, in this
exact shape:
{"detected_cards": [{"card_no": "5", "confidence": "high"}, ...]}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return json({ error: 'openai_error', detail: errText }, 502);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = /\{[\s\S]*\}/.exec(text);
      parsed = m ? JSON.parse(m[0]) : { detected_cards: [] };
    }

    return json(parsed);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
